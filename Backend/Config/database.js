const mongoose = require("mongoose")
require("dotenv").config()

const connecting=()=>{ mongoose.connect(process.env.DATABASE_URL).then(()=>{
    console.log("database connected successfully")
}).catch((err)=>{
    console.log("Database connection failed")
    console.error(err)
})
}

module.exports= connecting