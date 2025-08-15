const express = require("express")
const { signup, login, logout } = require("../controllers/userController")
const { purchasedCourses } = require("../controllers/coursePurchaseController")
const user_mid = require("../middlewares/user_mid")
const router= express.Router()


router.post("/signup",signup)
router.post("/login",login)
router.get("/logout",logout)

//COURSE-PURCHASE-ROUTES
router.get("/purchasedCourses",user_mid,purchasedCourses)

module.exports= router