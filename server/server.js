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

        let results = await db.query("SELECT * FROM articles");

        results.rows.forEach(row => {
            console.log(row)
        })

        res.send("received")
    })

    return app;
}

exports.buildServer = buildServer;