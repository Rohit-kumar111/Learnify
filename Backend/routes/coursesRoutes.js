const express = require("express")
const router = express.Router()
const {createCourse, updateCourse, deleteCourse, allCourses, getCourse} = require("../controllers/coursesController")
const { coursePurchase } = require("../controllers/coursePurchaseController")
const userPurchase= require("../middlewares/user_mid")
const adminMiddleware = require("../middlewares/admin_mid")

router.post("/createCourse",adminMiddleware,createCourse)
router.put("/updateCourse/:id",adminMiddleware,updateCourse)
router.delete("/deleteCourse/:id",adminMiddleware,deleteCourse)

router.get("/allcourses",allCourses)
router.get("/getCourse/:id",getCourse)

router.post("/buy/:courseId",userPurchase,coursePurchase)

module.exports= router