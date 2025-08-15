const jwt= require("jsonwebtoken")
require("dotenv").config()

const userMiddleware =(req,res,next)=>{
  
        const authheader = req.headers.authorization
        if(!authheader || !authheader.startsWith("Bearer")){
            return res.status(400).json({
                message:"Token is missing in request header"
            })
        }

     const token = authheader.split(" ")[1]//getting index 1 i.e only token  instead of bearer+token 
    //  console.log(token )
     try {
         const decode_payload= jwt.verify(token,process.env.JWT_USER_SECRET)
         req.userId = decode_payload.id
         next()
     } catch (error) {
        console.log(error)
         res.status(500).json({
            success:false,
                error:error.message
            })
     }
}

module.exports= userMiddleware