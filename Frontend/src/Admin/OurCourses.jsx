import React from 'react'
import axios from "axios"
import {Link, useNavigate} from "react-router-dom"
import {toast}  from "react-hot-toast"
import { useState,useEffect } from 'react'
import { BACKEND_URL } from '../utils/utils'
const OurCourses = () => {
  const [courses, setcourses] = useState([])
      const [loading, setloading] = useState(true);
     const navigate= useNavigate()

      const admin = JSON.parse(localStorage.getItem("admin"))//converts a JSON string back into a JavaScript object.
      const token = admin.token
      if(!token){
        toast.error("pls login as admin first")
        navigate("/admin/login")
         
      }
     useEffect(() => {
        const fetchCourses = async () => {
            try {
                let response = await axios.get(`${BACKEND_URL}/course/allCourses`, {
                    withCredentials: true
                })
                // console.log(response.data.allcoursesGet)
                setcourses(response.data.allcoursesGet)
                setloading(false)
            }
            catch (error) {
                console.log("error while fetching courses", error)
            }
        }
        fetchCourses()
    }, [])

    const deletehandler=async(id)=>{
      try {
        const response= await axios.delete(`${BACKEND_URL}/course/deleteCourse/${id}`,{
        headers:{
          Authorization:`Bearer ${token }`,
        },
        withCredentials:true,
        })
        toast.success(response.data.message)
        const  updatedCourses= courses.filter((course)=>course._id !== id)
        setcourses(updatedCourses)

      } catch (error) {
        console.log("error in deleting the course",error)
        toast.error(error.response.data.errors)
        console.log(error.response.data.errors || "error in deleting course")
      }
    }
    
  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }
  return (
     <div className="bg-gray-100 p-8 space-y-4 ">
      <h1 className="text-3xl font-bold text-center mb-8">Our Courses</h1>
      <Link
        className="bg-orange-400 py-2 px-4  shadow-sm shadow-black rounded-lg text-white hover:bg-orange-950 duration-300 ml-24 sm:ml-0 "
        to={"/admin/dashboard"}
      >
        Go to dashboard
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6  ">
        {courses.map((course) => (
          <div key={course._id} className="bg-white shadow-md rounded-lg p-4 ">
            {/* Course Image */}
            <img
              src={course?.image?.URL}
              alt={course.title}
              className="h-40 w-full object-cover  rounded-t-lg"
            />
            {/* Course Title */}
            <h2 className="text-xl font-semibold mt-4 text-gray-800">
              {course.title}
            </h2>
            {/* Course Description */}
            <p className="text-gray-600 mt-2 text-sm">
              {course.description.length > 200
                ? `${course.description.slice(0, 200)}...`
                : course.description}
            </p>
            {/* Course Price */}
            <div className="flex justify-between mt-4 text-gray-800 font-bold">
              <div>
                {" "}
                ₹{course.price}{" "}
                <span className="line-through text-gray-500">₹300</span>
              </div>
              <div className="text-green-600 text-sm mt-2">10 % off</div>
            </div>

            <div className="flex justify-between">
              <Link
                to={`/admin/course-update/${course._id}`}
                className="bg-orange-500 text-white py-2 px-4 mt-4 rounded hover:bg-blue-600"
              >
                Update
              </Link>
              <button
                onClick={() => deletehandler(course._id)}
                className="bg-red-500 text-white py-2 px-4 mt-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OurCourses
