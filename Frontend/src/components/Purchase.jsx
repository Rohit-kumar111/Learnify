import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { BACKEND_URL } from "../utils/utils";


const Purchase = () => {
  const [purchases, setpurchases] = useState([])
  const [islogedin, setislogedin] = useState(false)
  const [errormessage, seterrormessage] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)


  // console.log('purchses:',purchases)
  //CHECKING LOCALSTORAGE FOR TOKEN
  useEffect(() => {
    const token = localStorage.getItem("user")
    if (token) {
      setislogedin(true)
    }
    else {
      setislogedin(false)
    }
  }, [])

  // FETCHING PURCHASED COURSES
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    const token = user.token
    if (!token) {
      seterrormessage("pls login to purchase courses")
    }
    const purchaseCourses = async () => {
      try {
        let response = await axios.get(`${BACKEND_URL}/user/purchasedCourses`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        })
        setpurchases(response.data.courseData)

      }
      catch (error) {
        seterrormessage("failed to get purchased courses")
      }
    }
    purchaseCourses()
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
  function toggleSidebar() {
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
        className={`fixed top-0 left-0 h-screen bg-gray-100 w-64 p-5 transform z-10 transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"//Moved fully left due to minus (off the screen).
          } md:translate-x-0 md:static`}
      >

        <nav>
          <ul className="mt-16 md:mt-0">
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/course" className="flex items-center">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center text-blue-500">
                <FaDownload className="mr-2" /> Purchases
              </a>
            </li>
            <li className="mb-4">
              <Link to="/settings" className="flex items-center">
                <IoMdSettings className="mr-2" /> Settings
              </Link>
            </li>
            <li>
              {islogedin ? (
                <button onClick={logoutHandler} className="flex items-center">
                  <IoLogOut className="mr-2" /> Logout
                </button>
              ) : (
                <Link to="/login" className="flex items-center">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>



      {/* Main Content */}
      <div
        className="flex-1 bg-gray-50 mx-5"
      >
        <h2 className="text-xl ml-15 font-semibold mt-3 md:ml-0 mb-6">
          My Purchases
        </h2>

        {/* Error message */}
        {errormessage && (
          <div className="text-red-500 text-center mb-4">{errormessage}</div>
        )}

        {/* Render purchases */}
        {purchases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {purchases.map((purchase, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 mb-6"
              >
                <div className="flex flex-col items-center space-y-4">
                  {/* Course Image */}
                  <img
                    className="rounded-lg w-full h-48 object-cover"
                    src={
                      purchase.image.URL
                    }
                    alt={purchase.title}
                  />
                  <div className="text-center">
                    <h3 className="text-lg font-bold">{purchase.title}</h3>
                    <p className="text-gray-500">
                      {purchase.description.length > 100
                        ? `${purchase.description.slice(0, 100)}...`
                        : purchase.description}
                    </p>
                    <span className="text-green-700 font-semibold text-sm">
                      ₹{purchase.price} only
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You have no purchases yet.</p>
        )}
      </div>
    </div>
  )
}

export default Purchase
