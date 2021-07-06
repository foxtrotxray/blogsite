const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

exports.server = app;