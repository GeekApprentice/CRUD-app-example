import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import postRoutes from './routes/post.js'
import userRoutes from './routes/user.js'

const app = express()

dotenv.config()
app.use(bodyParser.json({limit: '30mb', extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))
app.use(cors())

app.use('/posts', postRoutes)
app.use('/user', userRoutes)

const CONNECTION_URI = process.env.CONNECTION_URI
const PORT = process.env.PORT

mongoose.connect(CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`connected to port: ${PORT}`)))
    .catch((error) => console.log(error.message))