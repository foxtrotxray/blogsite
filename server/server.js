const express = require('express')
const app = express()
const submissionText = "INSERT INTO articles(author_id, published, title, content) VALUES ($1, $2, $3, $4)";
const authText = "SELECT author_id FROM authors WHERE author_name = $1 AND author_password = $2";
const expressHandlebars = require('express-handlebars');

app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');

function buildServer(db) {
    app.use(express.static('public'))
    app.use(express.urlencoded({ extended: true }));
    
    // Get & display the titles of all articles
    app.get('/', async (req, res) => {
        // I don't know if this is a safe query
        let results = await db.query("SELECT title, article_id FROM articles ");
        // console.log(results.rows);
        res.render("home", {articles: results.rows});
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
            res.send ("Correct!");
        } else {
            res.redirect(302, '/loginFail');
        }
    })
    app.get('/loginFail', (req, res) => {
        res.render("loginFail");
    })    
    app.get('/form', (req, res) => {
        res.render("form");
    })    

    app.post("/submit", async (req, res) => {
        // if not authenticated, forward to login page
        // if (authorTest.rowCount === 0) {
        //     res.send("Incorrect name or password!");
        // if allowed, submit
        // } else {
        //     console.log("AuthorID: " + authorTest.rows[0].author_id);
        //     let submissionValues = [authorTest.rows[0].author_id,
        //                             'now()', req.body.title, req.body.article];
        //     try {
        //         const res = await db.query(submissionText, submissionValues)
        //         console.log(res.rows[0])
        //     } catch (err) {
        //         console.log(err.stack)
        //     }
            res.send("received");

        // }
    })

    return app;
}

exports.buildServer = buildServer;