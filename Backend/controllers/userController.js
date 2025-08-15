const User = require("../models/userSchema")
const bcrypt = require("bcrypt")
const { z, success } = require("zod")
const jwt = require("jsonwebtoken")
require("dotenv").config()

//SIGNUP
exports.signup = async (req, res) => {
   try {
      const { firstName, lastName, email, password } = req.body

      const users = z.object({
         firstName: z.string().min(3, { message: "firstName must be  atleast 3 characters" }),
         lastName: z.string().min(3, { message: "lastName must be atleast 3 characters" }),
         email: z.email(),
         password: z.string().min(6, { message: "password must be atleast 6 characters" }),
      })

      const validation = users.safeParse(req.body)
      if (!validation.success) {
         return res.status(400).json({
            errors: validation.error.issues.map((err) => err.message)
         })
      }

      const existingUser = await User.findOne({ email })

      if (existingUser) {
         return res.status(400).json({
            success: false,
            message: "User is already exist "
         })
      }
      //Encrypting password
      let hash_password
      try {
         hash_password = await bcrypt.hash(password, 4)
         const createdUser = await User.create({ firstName, lastName, email, password: hash_password })

         res.status(200).json({
            success: true,
            createdUser,
            message: "User created successfully"
         })
      } catch (error) {
         res.status(400).json({
            success: false,
            message: "hashing failed"
         })

      }


   } catch (error) {
      console.log(error)
      res.status(500).json({
         success: false,
         error: error.message
      })
   }
}


//LOGIN
exports.login = async (req, res) => {
   try {
      const { email, password } = req.body

      //checcking email and password empty
      if (!email || !password) {
         return res.status(400).json({
            success: false,
            message: "pls enter values "
         })
      }

      const user = await User.findOne({ email })
      //comparing password with db password
      const isPassCorrect = await bcrypt.compare(password, user.password)
      //checking  both email and password
      if (!user || !isPassCorrect) {
         return res.status(403).json({
            success: false,
            message: "Invalid Credentials"
         })
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_USER_SECRET, {
         expiresIn: "1d"
      })
      let options = {
         expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
         httpOnly: true,// can't be access through client side via js directly
         secure: process.env.NODE_ENV === "production",// true for http only
         sameSite: "Strict" // prevent from  CRF attacks 

      }

      res.status(200).cookie("jwt", token, options).json({
         success: true,
         message: " Login successfully", user, token
      })



   } catch (error) {
      console.log(error)
      res.status(500).json({
         success: false,
         error: error.message
      })
   }

}

//LOGOUT
exports.logout = async (req, res) => {
   // if (!req.cookies.jwt) {
   //    return res.status(400).json({
   //       message: "kidnly login first"
   //    })
   // }
   try {
      res.clearCookie("jwt", {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "Strict"
      }).json({
         success: true,
         message: "Logout successfully"
      });

   } catch (error) {
      console.log(error)
      res.status(500).json({
         success: false,
         error: error.message
      })
   }
}