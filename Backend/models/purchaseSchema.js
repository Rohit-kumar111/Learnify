const mongoose = require("mongoose")

const purchaseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref:"User"
    },
    courseId: {
        type:mongoose.Types.ObjectId,
        ref:"Course"
    },
},
{
    timestamps:true
}
   

)


module.exports = mongoose.model("Purchase", purchaseSchema)