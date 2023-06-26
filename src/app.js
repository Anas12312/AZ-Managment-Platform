const express = require('express')
const cors = require('cors')
require('./db/mongoose')
const userRouter = require('./routers/user')
const unitRouter = require('./routers/unit')
const nodeRouter = require('./routers/node')
const accountRouter = require('./routers/account')
const resourceRouter = require('./routers/resource')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use(accountRouter)
app.use(userRouter)
app.use(unitRouter)
app.use(nodeRouter)
app.use(resourceRouter)


app.listen(port, () => {
    console.log('Server is Running on port: ' + port)
})