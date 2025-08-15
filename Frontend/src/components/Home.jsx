import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import axios from "axios"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../utils/utils';

const Home = () => {
    const [courses, setcourses] = useState([])
    const [islogedin, setislogedin] = useState(false)
    const navigate = useNavigate()
    //CHECKING LOCALSTORAGE FOR TOKEN
       useEffect(()=>{
        const token = localStorage.getItem("user")
        if(token){
           setislogedin(true)
        }
        else{
            setislogedin(false)
        }
    },[])
 //LOGOUT HANDLER
  async function  logoutHandler(){
    try {
               const response = await axios.get(`${BACKEND_URL}/user/logout`,{
                withCredentials:true
               })
               toast.success(response.data.message)
                localStorage.removeItem("user");
               setislogedin(false)
               navigate("/")
               console.log(response.data.message)
    } catch (error) {
          console.log("error in logout",error)
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
                // console.log(response)
                // console.log(response.data.allcoursesGet)
                setcourses(response.data.allcoursesGet)
            }
            catch (error) {
                console.log("error while fetching courses", error)
            }
        }
        fetchCourses()
    }, [])
      
   
    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        autoplay:true,
        autoplaySpeed: 2000,

        responsive: [
            {
                breakpoint: 1475,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 762,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 0,
                    infinite: true,
                }
            },
            
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                }
            }
        ]
    };

    return (
        <div className='bg-gradient-to-r from-black to-gray-600 '>

            {/* HEADER */}
            <div className='h-[1250px] md:h-[1050px] text-white max-w-[75vw] mx-auto '>

                <nav className='flex items-center gap-x-10 justify-around  py-6 xs:justify-between '>
                    <div className='flex gap-x-2  relative right-9 xs:right-0' >
                        <img src="course_logo2.jpg" alt="" className='w-[35px] h-[35px] rounded-full' />
                        <h1 className='font-bold text-2xl text-yellow-400  '>Courses</h1>
                    </div>
                    <div className='space-x-3 xs:space-x-4  '>
                        {
                            islogedin?<button onClick={logoutHandler} className='border-2 bg-transparent border-white px-4 py-1  rounded-sm text-[14px] cursor-pointer'>Logout</button> : <>
                            <Link to={"/login"} className='border-2 bg-transparent border-white px-4 py-1 w-[5vw] rounded-sm text-[14px]'>Login</Link>
                        <Link to={"/signup"} className='border-2 bg-transparent border-white px-4 py-1 w-[5vw] rounded-sm text-[14px]'>Signup</Link>
                            </>
                            
                            
                        }
                        

                    </div>
                </nav>

                {/* MAIN */}
                <main >
                    {/* SECTION1 */}
                    <section className='text-center my-9 mb-18'>
                        <h1 className='text-4xl font-bold text-yellow-400' >Courses</h1>
                        <p className='mt-3 text-gray-300'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, quasi!</p><br />
                        <div className='flex xs:flex flex-row justify-center items-center'>
                            <Link to={"/course"} className='bg-yellow-500 py-2 px-4 mx-2 rounded font-semibold hover:bg-white hover:text-black duration-300'>Explore Courses</Link>
                            <Link to={"https://www.youtube.com/results?search_query=gate+smashers+playlist"} className='bg-white text-black py-2 px-4 mx-2 rounded font-semibold hover:bg-yellow-500 hover:text-white duration-300'>Courses video</Link>
                        </div>
                    </section>

                {/* SECTION-2 */}
                    <section className='mb-6'>
                        <Slider {...settings}>
                            {
                                courses.map((course) => {
                                    return <div key={course._id}>
                                        <div className='w-68 relative flex-shrink-0 transition-transform duration-300 transform hover:scale-105'>
                                            <div className='bg-gray-600 border-2  rounded-lg overflow-hidden'>
                                                <img className='h-32 w-50 mx-auto mt-2 rounded-lg ' src={course?.image?.URL || "vite.svg"} alt="" />

                                                <div className='p-6 text-center'>
                                                    <h2 className='text-white font-bold text-xl'>{course.title}</h2>
                                                    <button className='bg-yellow-600 px-3 py-1 mt-2 rounded-xl hover:bg-amber-500 text-[14px]'>Enroll now</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                        </Slider>
                    </section>
                </main>
                <hr />

                {/* FOOTER */}
                <footer className="my-12">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2">
                <img src="course_logo2.jpg" alt="" className="w-10 h-10 rounded-full" />
                <h1 className="text-2xl text-orange-500 font-bold">
                  Learnify
                </h1>
              </div>
              <div className="mt-3 ml-2 md:ml-8">
                <p className="mb-2">Follow us</p>
                <div className="flex space-x-4">
                  <a href="">
                    <FaFacebook className="text-2xl hover:text-blue-400 duration-300" />
                  </a>
                  <a href="">
                    <FaInstagram className="text-2xl hover:text-pink-600 duration-300" />
                  </a>
                  <a href="">
                    <FaTwitter className="text-2xl hover:text-blue-600 duration-300" />
                  </a>
                </div>
              </div>
            </div>

            <div className="items-center mt-6 md:mt-0 flex flex-col">
              <h3 className="text-lg font-semibold md:mb-4">connects</h3>
              <ul className=" space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  youtube- learn coding
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  telegram- learn coding
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Github- learn coding
                </li>
              </ul>
            </div>
            <div className="items-center mt-6 md:mt-0 flex flex-col">
              <h3 className="text-lg font-semibold mb-4">
                copyrights &#169; 2024
              </h3>
              <ul className=" space-y-2 text-center text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  Terms & Conditions
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Privacy Policy
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Refund & Cancellation
                </li>
              </ul>
            </div>
          </div>
        </footer>
            </div>
        </div>

    )
}

export default Home
