import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
dotenv.config()


const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

import auth from './routes/auth.router.js'
import connectToDB from './db/connectToMongoDB.js'
app.use("/api/auth", auth)

app.get("/", (req, res)=>{
    res.json({hello: "Working nice"})
})


app.listen(PORT, ()=>{
    console.log(`App is listening on pott ${PORT}`)
    connectToDB()
})