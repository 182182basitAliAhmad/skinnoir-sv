const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const SERVER_PORT = 5000
const SERVER = 'localhost'
const MONGO_PORT = 27017
const DATABASE_NAME = 'skinnoir'

const dbString = `mongodb://${SERVER}:${MONGO_PORT}/${DATABASE_NAME}`

const app = express()


mongoose
    .connect(dbString)
    .then(() => console.log('Connected to DB'))
    .catch(err => console.error('DB connection failed', err))


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

const authRoute = require('./routes/auth')
// const skinsRoute = require('./routes/skins')

app.use('/api/auth', authRoute)
// app.use('api/skin', skinsRoute)


app.get('/', (req, res) => res.send('Welcome to skinnoir'))

app.listen(SERVER_PORT, () => {
    console.log(`Backend server listening at http://localhost:${SERVER_PORT}`)
})

