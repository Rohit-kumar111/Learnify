const mongoose = require("mongoose")

const coursesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        public_id: {

            type: String,
            required: true,
        },
        URL: {
            type: String,
            required: true,
        }
    },
    price: {
        type: Number,
        required: true,
    },
    createrId:{
        type:mongoose.Types.ObjectId,
        ref:"Admin"
    }
},
{
    timestamps:true
}
)

module.exports = mongoose.model("Course", coursesSchema)