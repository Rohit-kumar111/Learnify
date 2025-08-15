const Course = require("../models/coursesSchema")
const cloudinary = require("cloudinary").v2


//CREATING COURSE
exports.createCourse = async (req, res) => {
    try {
        const adminId=req.adminId
        const { title, description, price } = req.body

        if (!title || !description || !price ) {
            return res.status(400).json({
                success: false,
                errors: " all fields are required "
            })
        }

        //FILEUPLOADING
        const { image } = req.files

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                success: false,
                errors: " pls upload image first "
            })
        }

        const allowedFormat = ["image/png", "image/jpeg"]
        if (!allowedFormat.includes(image.mimetype)) {// if allowedFormat does not includes the given type
            return res.status(400).json({
                success: false,
                errors: " pls upload in valid foramt :jpg or png "
            })
        }

        //CLOUDINARY
        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)
        if (!cloud_response || cloud_response.error) {
            return res.status(400).json({
                success: false,
                errors: "error in cloudinay "
            })
        }

        const course_data = {
            title,
            description,
            price,
            image: {
                public_id: cloud_response.public_id,
                URL: cloud_response.url
            },
            createrId:adminId
        }


        const course = await Course.create(course_data)

        res.status(200).json({
            success: true,
            course,
            message: "course created successfully"
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            errors: err.message,
        })
    }
}

//UPDATING THE COURSE
exports.updateCourse = async (req, res) => {
    try {
        const adminId=req.adminId
        const {id} = req.params
        const { title, description, price } = req.body

        const existingCourse= await Course.findById(id)
        if(!existingCourse){
            return  res.status(400).json({
            errors: "course not found "
        })
        }

         // Check if current admin is the creator
        if (existingCourse.createrId.toString() !== adminId.toString()) {
            return res.status(404).json({
                errors: "can't update , created by other admin"
            });
        }

        let imageData = existingCourse.image; // keep old image by default

        // If a new image is uploaded
        if (req.files && req.files.image) {
            const file = req.files.image;

            const allowedFormat = ["image/png", "image/jpeg"];
            if (!allowedFormat.includes(file.mimetype)) {
                return res.status(400).json({
                    success: false,
                    errors: "Please upload in valid format: jpg or png"
                });
            }



            // Upload new image to Cloudinary
            const cloud_response = await cloudinary.uploader.upload(file.tempFilePath);
            if (!cloud_response || cloud_response.error) {
                return res.status(400).json({
                    success: false,
                    errors: "error in cloudinary upload"
                });
            }

            imageData = {
                public_id: cloud_response.public_id,
                URL: cloud_response.url
            };
        }
        const updatedCourse = await Course.findOneAndUpdate(
            {_id:id,
             createrId:adminId,
            },
            {
                title,
                description,
                price,
                image: imageData,
                createrId:adminId,
                updatesAt: Date.now()

            },
            { new: true } // return updated document
        )
        
          res.status(200).json({
            success: true,
            updatedCourse,
            message: "course updated successfully"
        })
        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            errors: err.message,
        })
    }
}

//DELETING COURSE
exports.deleteCourse = async (req, res) => {
    try {
        adminId= req.adminId
        const {id} = req.params

        const deletedCourse = await Course.findOneAndDelete({_id:id,createrId:adminId}) 

        if(!deletedCourse){
            return  res.status(400).json({
            errors: "course can't be deletd, created by other admin "
        })
        }

          res.status(200).json({
            success: true,
            message: "course deleted successfully"
        })
        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            errors: err.message,
        })
    }
}


//GETTING ALL COURSES
exports.allCourses = async (req, res) => {
    try {

        const allcoursesGet = await Course.find({})

        if(!allcoursesGet){
            return res.status(400).json({
            success: false,
            message: "courses not find, pls send valid id"
        })
        }

          res.status(200).json({
            success: true,
            allcoursesGet,
        })
        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: err.message,
        })
    }
}


//GETTING COURSE
exports.getCourse = async (req, res) => {
    try {
        const {id}= req.params

        const course = await Course.findById(id)

        if(!course){
            return res.status(400).json({
            success: false,
            message: "course not find, pls send valid id"
        })
        }

          res.status(200).json({
            success: true,
            course,
        })
        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: err.message,
        })
    }
}