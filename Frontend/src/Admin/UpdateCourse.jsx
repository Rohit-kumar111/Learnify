import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import axios from "axios"
import { BACKEND_URL } from '../utils/utils'

const UpdateCourse = () => {
  const { id } = useParams()

  const [title, settitle] = useState("")
  const [image, setimage] = useState("")
  const [price, setprice] = useState("")
  const [description, setdescription] = useState("")
  const [imagePreview, setimagePreview] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/course/getCourse/${id}`, {
          withCredentials: true,
        })
        console.log(data)
        settitle(data.course.title)
        setdescription(data.course.description)
        setprice(data.course.price)
        setimagePreview(data?.course?.image?.URL)
      } catch (error) {
        console.log(error)
        toast.error("failed to fetch course")
      }
    }
    fetchCourseData()
  }, [id])

  const changePhotoHandler = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setimagePreview(reader.result)
      setimage(file)
    }
  }

  const handleUpdateCourse = async (e) => {
    e.preventDefault()
    const formData = new FormData()//JavaScript object for building multipart/form-data requests.This format is needed when uploading files to the server because it can handle both text and binary data
    formData.append("title", title)
    formData.append("description", description)
    formData.append("price", price)
    if (image) { formData.append("image", image) }
    const admin = JSON.parse(localStorage.getItem("admin"))
    const token = admin?.token//If admin is not null or undefined, get admin.token.Otherwise, return undefined instead of throwing an error


    if (!token) {
      toast.error("login first")
      navigate("/admin/login")
      return
    }

    try {
      const response = await axios.put(`${BACKEND_URL}/course/updateCourse/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })
      console.log(response.data)
      toast.success(response.data.message || "course updated successfully")
      navigate("/admin/our-courses")
      settitle("")
      setprice("")
      setimage("")
      setdescription("")
      setimagePreview("")
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.errors)
    }
  }

  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center py-10 bg-gradient-to-r from-black to-blue-700 ">
        <div className=" max-w-2xl  p-6 border-2 border-white  rounded-lg shadow-xl shadow-black mx-6 bg-gradient-to-r from-gray-8=900 to-gray-400 text-white">
          <h3 className="text-2xl font-semibold mb-8 ">Create Course</h3>

          <form onSubmit={handleUpdateCourse} className="space-y-6 ">
            <div className="space-y-2">
              <label className="block text-lg">Title</label>
              <input
                type="text"
                placeholder="Enter your course title"
                value={title}
                onChange={(e) => settitle(e.target.value)}
                className="w-full px-3 py-2 border border-white  rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Description</label>
              <input
                type="text"
                placeholder="Enter your course description"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
                className="w-full px-3 py-2 border border-white  rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Price</label>
              <input
                type="number"
                placeholder="Enter your course price"
                value={price}
                onChange={(e) => setprice(e.target.value)}
                className="w-full px-3 py-2 border border-white  rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Course Image</label>
              <div className="flex items-center justify-center">
                <img
                  src={imagePreview ? `${imagePreview}` : "/imgPL.webp"}
                  alt="Image"
                  className="w-full max-w-sm h-auto rounded-md object-cover"
                />
              </div>
              <input
                type="file"
                onChange={changePhotoHandler}
                className="w-full px-3 py-2 border border-white  rounded-md outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
            >
              Create Course
            </button>
          </form>
        </div>
      </div>
      {/* <div className="min-h-screen py-10">
        <div className="max-w-2xl mx-auto p-6 border rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-8">Update Course</h3>

          <form onSubmit={handleUpdateCourse} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-lg">Title</label>
              <input
                type="text"
                placeholder="Enter your course title"
                value={title}
                onChange={(e) => settitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Description</label>
              <input
                type="text"
                placeholder="Enter your course description"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Price</label>
              <input
                type="number"
                placeholder="Enter your course price"
                value={price}
                onChange={(e) => setprice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Course Image</label>
              <div className="flex items-center justify-center">
                <img
                  src={imagePreview ? `${imagePreview}` : "/imgPL.webp"}
                  alt="Course"
                  className="w-full max-w-sm h-auto rounded-md object-cover"
                />
              </div>
              <input
                type="file"
                onChange={changePhotoHandler}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
            >
              Update Course
            </button>
          </form>
        </div>
      </div> */}
    </div>
  )
}

export default UpdateCourse
