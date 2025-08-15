const Course = require("../models/coursesSchema")
const Purchase = require("../models/purchaseSchema")
const Stripe = require("stripe")
require("dotenv").config()

//BUYING COURSE
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
        console.log(process.env.STRIPE_SECRET_KEY)
exports.coursePurchase = async (req, res) => {
    try {
        const { userId } = req//from token sending via login 
        const { courseId } = req.params

        //CHECKING IN COURSE MODEL WHETHER COURSES YOU ARE TRYING TO BUY IS EXIST OR NOT
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(400).json({
                errors: "course not find "
            })
        }


        //CHECKING COURSE IS ALREADY PURCHASED OR NOT IN PURCHASE MODEL
        const existing = await Purchase.findOne({ userId, courseId })

        if (existing) {
            return res.status(400).json({
                errors: "course is already purchased "
            })
        }

        //STRIPE PAYMENT CODE STARTS FROM HEERE!
      
        const amount = course.price

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            payment_method_types: ["card"],
        });

        res.status(200).json({
            success: true,
            course,
            clientSecret: paymentIntent.client_secret,
            message: "You can buy "
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            errors: error.message
        })
    }
}

// SHOWING ALL PURCHASED COURSES
exports.purchasedCourses = async (req, res) => {
    try {
        const userId = req.userId

        const purchased = await Purchase.find({ userId })
        let purchasedCourseId = []

        for (let i = 0; i < purchased.length; i++) {
            purchasedCourseId.push(purchased[i].courseId)
        }
        const courseData = await Course.find({
            _id: { $in: purchasedCourseId }//$in is a MongoDB query operator used to match any value from a given array.


        })

        res.status(200).json({
            success: true,
            purchased,
            courseData
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            errors: error.message
        })
    }
}