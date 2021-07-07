const {server} = require("./server")
const path = require('path')
const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Blogsite online @ http://localhost:${PORT}`)
})