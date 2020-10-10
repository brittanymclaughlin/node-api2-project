const express = require("express")
const postsRouter = require("./posts/postsRouter")
const server = express()
const port = 4000


server.use(express.json())
server.use(postsRouter)






// create endpoint that returns all the posts for a user
// create endpoint for adding a new post for a user

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})