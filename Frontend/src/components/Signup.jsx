import axios from 'axios'
import React from 'react'
import { useState } from "react"
import toast from 'react-hot-toast'
import { Link, useNavigate } from "react-router-dom"
import { BACKEND_URL } from '../utils/utils'
const Signup = () => {
  const [firstName, setfirstName] = useState("")
  const [lastName, setlastName] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [msg, setmsg] = useState("")
  const navigate = useNavigate()
  async function formHandler(e) {
    e.preventDefault()
    try {

      const response = await axios.post(`${BACKEND_URL}/user/signup`, {// sending the data
        firstName,
        lastName,
        email,
        password
      }, {
        withcredentials: true,
        headers: {
          "Content-Type": "application/json"//data we are sending is in json format
        }

      })
      toast.success(response.data.message)
      console.log("signup successfull", response)
      navigate("/login")
    } catch (error) {

      setmsg(error.response?.data?.errors?.join('\n') || error.response?.data?.message || "Signup failed");

      // If error.response exists, then check data.
      // If data exists, then check message.
      // If any of them is missing (undefined or null), it won’t crash – it just gives undefined.

      //     .join('\n') converts that array into:string
      // lastName must be at least 3 characters
      // password must be at least 6 characters

    }

  }
  return (

    <div className='bg-gradient-to-r from-black to-green-800' >
      <div className='h-screen flex items-center justify-center text-white max-w-[75vw] mx-auto '>
        {/* HEADER */}
        <nav className=' absolute top-0 left-0 w-full flex items-center justify-between py-6 '>
          <div className='flex gap-x-2 ml-4' >
            <img src="course_logo2.jpg" alt="" className='w-[35px] h-[35px] rounded-full' />
            <h1 className='font-bold text-2xl text-yellow-400'>Courses</h1>
          </div>
          <div className='space-x-4 sm:space-x-2 sm:right-6 relative right-3'>
            <Link to={"/login"} className='border-2 bg-transparent border-white px-4 py-1 w-[5vw] rounded-sm text-[14px]'>Login</Link>
            <Link to={"/admin/signup"} className='border-2  border-white px-4 py-1 w-[5vw] rounded-sm text-[14px] bg-yellow-600'>Admin</Link>
          </div>
        </nav>

        {/* SIGNUP FORM */}
        <div className=" bg-gray-900 p-4 rounded-lg shadow-lg w-[500px] scale-y-100 scale-x-140 sm:scale-100 sm:p-8  m-8 md:m-0 mt-20">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Welcome to <span className="text-yellow-500">Learnify</span>
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Just Signup To Join Us!
          </p>

          <form onSubmit={formHandler}>
            {/* firstName */}
            <div className="mb-4">
              <label htmlFor="firstname" className=" text-gray-400 mb-2">
                Firstname
              </label>
              <input
                type="text"
                id="firstname"
                value={firstName}
                onChange={(e) => setfirstName(e.target.value)}
                className="w-full mt-1 p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your firstname"
              />
            </div>
            {/* lastName */}
            <div className="mb-4">
              <label htmlFor="lastname" className=" text-gray-400 mb-2">
                Lastname
              </label>
              <input
                type="text"
                id="lastname"
                value={lastName}
                onChange={(e) => setlastName(e.target.value)}
                className="w-full mt-1 p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your lastname"
                required
              />
            </div>
            {/* E-mail */}
            <div className="mb-4">
              <label htmlFor="email" className=" text-gray-400 mb-2">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                className="w-full mt-1 p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="name@email.com"
                required
              />
            </div>
            {/* password */}
            <div className="mb-4">
              <label htmlFor="password" className=" text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  className="w-full mt-1 p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                  required
                />
                <span className="absolute right-3 top-3 text-gray-500 cursor-pointer">
                  👁️
                </span>
              </div>
             <div>
               {
                msg && (
                  <div className='text-red-700 text-center my-2'>
                    {msg}
                  </div>
                )
              }
             </div>

            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-green-600 text-white py-3 px-6 rounded-md transition"
            >
              Signup
            </button>
          </form>
        </div>

      </div>
    </div >
  )
}

export default Signup