import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import axios from "axios"
import { HiMenu, HiX } from "react-icons/hi";
import { BACKEND_URL } from '../utils/utils';

const Dashboard = () => {
         const [sidebarOpen, setSidebarOpen] = useState(false)
   
    async function  logoutHandler(){
    try {
               const response = await axios.get(`${BACKEND_URL}/admin/logout`,{
                withCredentials:true
               })
               toast.success(response.data.message)
                localStorage.removeItem("admin");
              //  navigate("/admin/login")
              //  console.log(response.data.message)
    } catch (error) {
          console.log("error in logout",error)
          toast.error(error.response?.data?.message || "Logout failed")

    }
 }
 function toggleSidebar(){
  setSidebarOpen(!sidebarOpen)
 }
  return (
     <div className="flex h-screen bg-gradient-to-r from-black to-blue-700  ">
      
     {/* Hamburger menu button for mobile */}
          <button
            className="md:hidden fixed top-4 left-4 z-20 text-3xl text-gray-800"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <HiX /> : <HiMenu />} {/* Toggle menu icon */}
          </button>
    
          {/* Sidebar */}
          <aside
            className={`fixed top-0 left-0 h-screen bg-gray-300 w-64 p-5 transform z-10 transition-transform duration-300 ease-in-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"//Moved fully left due to minus (off the screen).
            } md:translate-x-0 md:static`}
          >

        <div className="flex items-center flex-col mb-10">
          <img src="/course_logo.jpg" alt="Profile" className="rounded-full h-20 w-20" />
          <h2 className="text-lg font-semibold mt-4">I'm Admin</h2>
        </div>
        <nav className="flex flex-col space-y-4">
          <Link to="/admin/our-courses">
            <button className="w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded">
              Our Courses
            </button>
          </Link>
          <Link to="/admin/course-create">
            <button className="w-full bg-orange-500 hover:bg-blue-600 text-white py-2 rounded">
              Create Course
            </button>
          </Link>

          <Link to="/">
            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded">
              Home
            </button>
          </Link>
          <Link to="/admin/login">
            <button
              onClick={logoutHandler}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
            >
              Logout
            </button>
          </Link>
        </nav>
      </aside>
      <div className="flex h-screen text-4xl items-center justify-center ml-[35%] text-white">
        Welcome!!!
      </div>
    </div>
  )
}

export default Dashboard
