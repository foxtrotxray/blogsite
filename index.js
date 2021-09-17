const {buildServer} = require("./server/server")
const db = require('./server/db')
const path = require('path')
const PORT = process.env.PORT || 5000
require('dotenv').config();
let server = buildServer(db)

server.listen(PORT, () => {
  console.log(`Blogsite online @ http://localhost:${PORT}`)
})