const express = require('express')
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const submissionText = "INSERT INTO articles(author_id, published, title, content) VALUES ($1, $2, $3, $4)";
const authText = "SELECT author_id FROM authors WHERE author_name = $1 AND author_password = $2";

function buildServer(db) {
    let app = express()
    app.engine('handlebars', expressHandlebars());
    app.set('view engine', 'handlebars');
    // app.use(express.static('public'));
    app.use(express.urlencoded({ extended: true }));
    app.use(session({ secret: process.env.COOKIE_SECRET,
                      cookie: { maxAge: 600000},
                      saveUninitialized: false,
                      resave: false
                    }))
    
    // Get & display the titles of all articles
    app.get('/', async (req, res) => {
        // I don't know if this is a safe query
        let results = await db.query("SELECT title, article_id FROM articles ");
        // console.log(results.rows);
        res.render("home", {articles: results.rows, loggedIn: req.session.loggedIn});
    })
    
    // retrieve a specific article based on it's id
    app.get('/view/:id', async (req, res) => {
        let query = {
            name: "view query",
            text: "SELECT articles.*, authors.author_id, authors.author_name FROM articles, authors WHERE articles.article_id = $1 AND articles.author_id = authors.author_id",
            values: [req.params.id]
        };
        await db.query(query)
            .then(result => {
                result.rows[0].published = new Date(result.rows[0].published).toDateString()
                res.render("partials/articlePage", result.rows[0]);
            })
            .catch(e => res.send("<pre>" + e.stack + "</pre>"));
    })

    app.get('/loginPage', (req, res) => {
        res.render("loginPage");
    })

    app.post('/login', async (req, res) => {
        let credentials = [req.body.name, req.body.password];
        let authorTest  = await db.query(authText, credentials);
        if (authorTest.rowCount === 1) {
            // start session
            req.session.user = req.body.name;
            req.session.loggedIn = true;
            req.session.author_id = authorTest.rows[0].author_id;
            console.log(req.session, req.sessionID)
            res.redirect(302, "/");
        } else {
            res.redirect(302, '/loginFail');
        }
    })

    app.get('/loginFail', (req, res) => {
        res.render("loginFail");
    })

    app.get('/logOut', (req, res) =>{
        req.session.destroy(function(err) {
            res.redirect(302, "/")
          })
    })

    app.get('/form', (req, res) => {
        if (req.session.loggedIn) {
            res.render("form");
        } else {
            res.redirect(401, '/login')
        }
    })    

    app.post("/submit", async (req, res) => {
        // if not authenticated, forward to login page
        if (req.session.loggedIn) {
            let submissionValues = [req.session.author_id,
                                    'now()', req.body.title, req.body.article];
            try {
                const res = await db.query(submissionText, submissionValues)
            } catch (err) {
                console.log(err.stack)
            }
            res.redirect(302, "/");
        } else {
            res.redirect(401, "/loginPage")
        } 
    })

    return app;
}

exports.buildServer = buildServer;