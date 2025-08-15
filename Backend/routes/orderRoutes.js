const express= require("express")
const orderController = require("../controllers/orderConttroller")
const userMiddleware = require("../middlewares/user_mid")
const router = express.Router()

router.post("/",userMiddleware,orderController)

module.exports=router