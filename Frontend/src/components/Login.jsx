import React from 'react'
import axios from"axios"
import { useState } from 'react'
import {Link, useNavigate} from "react-router-dom"
import toast from 'react-hot-toast'
import { BACKEND_URL } from '../utils/utils'

const Login = () => {
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [msg, setmsg] = useState("")
    const navigate = useNavigate()

   async function formHandler(e){
      e.preventDefault()
      try {
       
         const response= await axios.post(`${BACKEND_URL}/user/login`,{// sending the data
          email,
          password
         },{
          withcredentials:true,
          headers:{
            "Content-Type":"application/json"//data we are sending is in json format
          }
          
         })
         toast.success(response.data.message)
         console.log("Login successfully",response.data)
         localStorage.setItem("user",JSON.stringify(response.data))//STORING IN LOCALSTORAGE
         navigate("/")
      } catch (error) {

setmsg(error.response?.data?.errors?.join('\n') || error.response?.data?.message || "Login failed");
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
          <div className='flex space-x-2 ml-4' >
            <img src="course_logo2.jpg" alt="" className='w-[35px] h-[35px] rounded-full' />
            <Link to={"/"} className='font-bold text-2xl text-yellow-400'>Courses</Link>
          </div>
          <div className='space-x-2 sm:space-x-2 sm:right-6 relative right-3 '>
            <Link to={"/signup"} className='border-2 bg-transparent border-white px-4 py-1 w-[96px] rounded-sm text-[14px]'>Signup</Link>
            <Link to={"/admin/signup"} className='border-2  border-white px-4 py-1 w-[96px] rounded-sm text-[14px] bg-yellow-600'>Admin</Link>
          </div>
        </nav>

        {/* LOGIN FORM */}
        <div className=" bg-gray-900 p-4 rounded-lg shadow-lg w-[500px] scale-y-105 scale-x-120 sm:scale-100 sm:p-8  md:m-0 mt-20">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Welcome to <span className="text-yellow-500">Learnify</span>
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Login to access paid courses
          </p>

          <form onSubmit={formHandler}>
           
            {/* E-mail */}
            <div className="mb-4">
              <label htmlFor="email" className=" text-gray-400 mb-2">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e)=>setemail(e.target.value)}
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
                    onChange={(e)=>setpassword(e.target.value)}
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
                  <div className='text-red-700 my-2 text-center'>
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
                Login
              </button>
          </form>
        </div>

      </div>
    </div >
  )
}



export default Login
