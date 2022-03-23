import express from "express";
import dotenv from 'dotenv'

dotenv.config({})

import Connection from "./db/connection.js";
import userRoutes from "./routes/userRoutes.js";
import bodyParser from "body-parser";
import cors from 'cors'
import cookieParser from "cookie-parser";
 

// for image uploading
import cloudinary from 'cloudinary'
import fileUpload from 'express-fileupload'

const app = express()
const port = process.env.PORT || 4000
app.use(fileUpload({
    useTempFiles : true
}))

app.use(cors());
 
app.use(cookieParser())
 

app.use(bodyParser.json({ extends: true }))
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user",userRoutes)

// setup of cloudinary for images
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY
})

//database connection
Connection()

app.listen(port, () => {
    console.log(`server successfully running on ${port} port`)
})