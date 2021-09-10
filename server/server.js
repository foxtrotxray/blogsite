const express = require('express')
const app = express()
const submissionText = "INSERT INTO articles(author_id, published, title, content) VALUES ($1, $2, $3, $4)";
const authText = "SELECT author_id FROM authors WHERE author_name = $1 AND author_password = $2";

function buildServer(db) {
    app.use(express.static('public'))
    app.use(express.urlencoded({ extended: true }));
    
    // Get & display the titles of all articles
    app.get('/', async (req, res) => {
        let htmlBuilder = "<ol>"  
        let results = await db.query("SELECT title, article_id FROM articles ");
        results.rows.forEach(row => {
            console.log(row);
            htmlBuilder += `<li><a href="view/${row.article_id}">${row.title}</a></li>`;
        })
        htmlBuilder += "</ol>";
        
        res.send(htmlBuilder);



    })
    
    // if there are ten more posts, get them; or all remaining
    app.get('/more', (req, res) => {
        res.send('sending more entries!')
    })


    app.post("/submit", async (req, res) => {
        console.log("Request body:", req.body)
        let credentials = [req.body.name, req.body.password];
        let authorTest  = await db.query(authText, credentials);
        if (authorTest.rowCount === 0) {
            res.send("Incorrect name or password!");
        } else {
            console.log("AuthorID: " + authorTest.rows[0].author_id);
            let submissionValues = [authorTest.rows[0].author_id,
                                    'now()', req.body.title, req.body.article];
            try {
                const res = await db.query(submissionText, submissionValues)
                console.log(res.rows[0])
            } catch (err) {
                console.log(err.stack)
            }
            // this snippet displays all the articles in the console
            // let results = await db.query("SELECT * FROM articles");
            // results.rows.forEach(row => {
            //     console.log(row)
            // })
    
            res.send("received");

        }
    })

    return app;
}

exports.buildServer = buildServer;