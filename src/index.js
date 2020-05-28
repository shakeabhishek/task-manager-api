const express = require('express')
require('./db/mongoose')  // We are not fetching anything which means this ensures this file (in turn the db connection) runs before this file.
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const emailRouter = require('./routers/email')

const app = express()
const port = process.env.PORT  //Since this will be deployed to heroku where port might not be 3000

// Middleware, can be used for logging or checking if session exists
// app.use((req, res, next) => {
//     if(req.method === 'GET') {
//         res.send('GET requests are disabled!')
//     } else {
//         next()   
//     }
// })


// Uncomment for maintenance
// app.use((req, res, next) => {
//     res.status(503).send('Service is temporarily down for maintenance')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(emailRouter)

// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', {expiresIn: '1 day'})
//     console.log(token)
//     const data = jwt.verify(token, 'thisismynewcourse')
//     console.log(data)
// }

// myFunction()


// const Task = require('./models/task')
// const main = async () => {
//     const task = await Task.findById('abcde')
//     await task.populate('owner').execPopulate()  => This will return every property of User with ID in owner
//     console.log(task.owner)

//  same for tasks
// }

/////////////////////////////////////////////////

// ADDING FILE UPLOAD TO EXPRESS

// const multer = require('multer')
// const upload = multer({
//     dest: 'images'
// })

// // adding JSON error instead of HTML error to file upload middleware

// const errorMiddleware = (req, res, next) => {
//     throw new Error('Error from my middleware')
// }

// // single is a middleware from multer library
// // argument to single should be same as form input name for the image

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send(error: error.message)
// })

/////////////////////////////////////////////////



app.listen(port, () => {
    console.log('Server is up on port ' +port)
})