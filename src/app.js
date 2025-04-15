const express = require('express')
const cors = require('cors')
const path = require('path')
require("dotenv").config({ path: path.join(__dirname, '../.env') })
console.log('Environment variables:', {
    PORT: process.env.PORT,
    DB_CONNECT: process.env.DB_CONNECT ? 'DB_CONNECT is set' : 'DB_CONNECT is not set',
    SECRET: process.env.SECRET ? 'SECRET is set' : 'SECRET is not set'
})
require('./db/mongoose')
const userRouter = require('./routers/user')
const unitRouter = require('./routers/unit')
const nodeRouter = require('./routers/node')
const accountRouter = require('./routers/account')
const resourceRouter = require('./routers/resource')
const fileRouter = require('./routers/file')
const notificationRouter = require('./routers/notification')
const fileUpload = require('express-fileupload')

const app = express()
const port = parseInt(process.env.PORT) || 3000

app.use(cors())
app.use(express.json())
app.use(fileUpload())
app.use(accountRouter)
app.use(userRouter)
app.use(unitRouter)
app.use(nodeRouter)
app.use(resourceRouter)
app.use(fileRouter)
app.use(notificationRouter)

app.listen(port, () => {
    console.log('Server is Running on port: ' + port)
})