const Order= require("../models/orderSchema")
const Purchase = require("../models/purchaseSchema")
const orderController = async(req,res)=>{
  try {
     const order= req.body

     const orderInfo= await Order.create(order)
   
     const userId= orderInfo.userId
     const courseId= orderInfo.courseId
      res.status(200).json({
        success:true,
        message:"order details",orderInfo
      })
     if(orderInfo){
         await Purchase.create({ userId, courseId })
     }
  
  } catch (error) {
    console.log("Error in order",error)
     res.status(401).json({
        success:false,
        message:"Error in order created"
     })
  }
}

module.exports= orderController