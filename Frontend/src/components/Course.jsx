import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API call
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { BACKEND_URL } from "../utils/utils";




const Course = () => {
    const [courses, setcourses] = useState([])
    const [islogedin, setislogedin] = useState(false)
    const [loading, setloading] = useState(true);
      const [sidebarOpen, setSidebarOpen] = useState(false)
    const navigate = useNavigate()
   
    //  console.log(courses)
    //CHECKING LOCALSTORAGE FOR TOKEN
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))
        const token = user?.token
        if(!token) {
            setislogedin(false)
            toast.error("pls login first")
            navigate("/login")
        }
         else{
             setislogedin(true)
             navigate("/course")
         }
        
    }, [])
    //LOGOUT HANDLER
    async function logoutHandler() {
        try {
            const response = await axios.get(`${BACKEND_URL}/user/logout`, {
                withCredentials: true
            })
            toast.success(response.data.message)
            localStorage.removeItem("user");
            setislogedin(false)
            navigate("/")
            console.log(response.data.message)
        } catch (error) {
            console.log("error in logout", error)
            toast.error(error.response?.data?.message || "Logout failed")

        }
    }
    // FETCHING ALL COURSES
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
    function toggleSidebar(){
        setSidebarOpen(!sidebarOpen)
    }

    return (
        <div className="flex">
      {/* Hamburger menu button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 text-3xl text-gray-800"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <HiX /> : <HiMenu />} {/* Toggle menu icon */}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-100 w-64 p-5 transform z-10 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"//Moved fully left due to minus (off the screen).
        } md:translate-x-0 md:static`}
      >
                 <div className="flex items-center mb-10 mt-10 md:mt-0">
          <img src="course_logo2.jpg" alt="Profile" className="rounded-full h-12 w-12" />
        </div>
        
        <nav>
          <ul>
            <li className="mb-4">
              <a href="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center text-blue-500">
                <FaDiscourse className="mr-2" /> Courses
              </a>
            </li>
            <li className="mb-4">
              <a href="/purchase" className="flex items-center">
                <FaDownload className="mr-2" /> Purchases
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center">
                <IoMdSettings className="mr-2" /> Settings
              </a>
            </li>
            <li>
              {islogedin ? (
                <Link to={"/"}
                  
                  className="flex items-center"
                  onClick={logoutHandler}
                >
                  <IoLogOut className="mr-2" /> Logout
                </Link>
              ) : (
                <Link to={"/login"} className="flex items-center">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-0 md:ml-4 w-full bg-white p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-xl font-bold">Courses</h1>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 ml-8 rounded-l-full px-4 py-2 h-10 w-30 md:w-full focus:outline-none"
              />
              <button className="h-10 border border-gray-300 rounded-r-full px-4 flex items-center justify-center">
                <FiSearch className="text-xl text-gray-600" />
              </button>
            </div>

            <FaCircleUser className="text-4xl text-blue-600 mr-2" />
          </div>
        </header>

        {/* Vertically Scrollable Courses Section */}
        <div className="overflow-y-auto h-[75vh]">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : courses.length === 0 ? (
            // Check if courses array is empty
            <p className="text-center text-gray-500">
              No course posted yet by admin
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <img
                    src={course.image.URL}
                    alt={course.title}
                    className="rounded mb-4 md:h-[400px]"
                  />
                  <h2 className="font-bold text-lg mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-4">
                    {course.description.length > 100
                      ? `${course.description.slice(0, 100)}...`
                      : course.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-xl">
                      ₹{course.price}{" "}
                      <span className="text-gray-500 line-through">5999</span>
                    </span>
                    <span className="text-green-600">20% off</span>
                  </div>

                  {/* Buy page */}
                  <Link
                    to={`/buy/${course._id}`} // Pass courseId in URL
                    className="bg-orange-500 w-full text-white px-4 py-2 rounded-lg hover:bg-blue-900 duration-300"
                  >
                    Buy Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
        </div>
    )
}

export default Course
