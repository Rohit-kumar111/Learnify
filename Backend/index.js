const express = require("express")
const app= express()
require("dotenv").config()
const connecting = require("./Config/database")
 const courseRoute= require("./routes/coursesRoutes")
 const userRoute= require("./routes/userRoutes")
 const adminRoute = require("./routes/adminRoutes")
const cloudinary = require("cloudinary").v2
const fileUpload =require("express-fileupload")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const orderRoute = require("./routes/orderRoutes")
const PORT= process.env.PORT || 4000

//MIDDLEWARES
app.use(express.json())
app.use(cookieParser())

app.use(cors({
origin:process.env.FRONTEND_URL,
credentials:true,
methods:["POST","GET","PUT","DELETE"],
allowedHeaders:["Content-Type","Authorization"]
}))

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

 // Configuration
    cloudinary.config({ 
        cloud_name: process.env.cloud_name, 
        api_key: process.env.api_key, 
        api_secret: process.env.api_secret 
    });
    

app.get("/",(req,res)=>{
    res.send("Hello World")
})

connecting()//Database 

 app.use("/api/v1/course",courseRoute)
 app.use("/api/v1/user",userRoute)
 app.use("/api/v1/admin",adminRoute)
 app.use("/api/v1/order",orderRoute)

app.listen(PORT,()=>{
 console.log("App is listening at PORT",PORT)
})