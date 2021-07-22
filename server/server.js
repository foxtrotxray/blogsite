const express = require('express')
const app = express()


// get ten posts from the DB 
app.get('/', (req, res) => {
    res.send('Placeholder for the first ten blog posts!')
})

// if there are ten more posts, get them; or all remaining
app.get('/more', (req, res) => {
    
    res.send('sending more entries!')
})


exports.server = app;