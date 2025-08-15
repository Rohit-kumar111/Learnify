const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  email: String,
        userId: String,
        courseId: String,
        paymentId: String,
        amount: Number,
        status: String,
},
{
  timestamps:true
}
)

module.exports= mongoose.model("Order",orderSchema)