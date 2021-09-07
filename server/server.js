const express = require('express')
const app = express()

function buildServer(db) {
    app.use(express.static('public'))
    app.use(express.urlencoded({ extended: true }));
    
    // client.conn 
    // get ten posts from the DB 
    app.get('/', (req, res) => {
        res.send('Placeholder for the first ten blog posts!')
    })
    
    // if there are ten more posts, get them; or all remaining
    app.get('/more', (req, res) => {
        res.send('sending more entries!')
    })


    app.post("/submit", async (req, res) => {
        console.log("Request body:", req.body)
        let credentials = [req.body.name, req.body.password];
        let authorTest  = await db.query(
            `SELECT author_id FROM authors
            WHERE author_name = '${credentials[0]}' 
            AND author_password = '${credentials[1]}'`);
        if (authorTest.rowCount === 0) {
            res.send("Incorrect name or password!");
        } else {
            console.log("AuthorID: " + authorTest.rows[0].author_id);
            // db.query(`INSERT INTO articles VALUES(
            //     default, 
            //     ${authorTest.rows[0].author_id},
            //     now(), 'very technical article, part 2', 'whereas UDP is equally challenging...');`)
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