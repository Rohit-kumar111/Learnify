import React from 'react';
import { Navigate, Route,Routes } from 'react-router-dom'
import './App.css'
import Signup from './components/Signup'
import Login from './components/Login'
import Home from './components/Home'
import { Toaster } from 'react-hot-toast';
import Course from './components/Course';
import Purchase from './components/Purchase';
import Buy from './components/Buy';
import AdminLogin from './Admin/AdminLogin';
import AdminSignup from './Admin/AdminSignup';
import Dashboard from './Admin/Dashboard';
import CourseCreate from './Admin/CourseCreate';
import UpdateCourse from './Admin/UpdateCourse';
import OurCourses from './Admin/OurCourses';

function App() {

  const user = JSON.parse(localStorage.getItem("user"))
  const admin = JSON.parse(localStorage.getItem("admin"))
  return (
    <>
     <div>
      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>

      {/* other routes */}

      <Route path='/course' element={<Course/>}/>
      <Route path='/purchase' element={user?<Purchase/>:<Navigate to={"/login"}/>}/>
      <Route path='/buy/:courseId' element={<Buy/>}/>


      {/* ADMIN ROUTES */}

<Route path='/admin/login' element={<AdminLogin/>} />
<Route path='/admin/signup' element={<AdminSignup/>} />
<Route path='/admin/dashboard' element={admin?<Dashboard/>:<Navigate to={"/admin/login"}/>} />
<Route path='/admin/course-create' element={<CourseCreate/>} />
<Route path='/admin/course-update/:id' element={<UpdateCourse/>} />
<Route path='/admin/our-courses' element={<OurCourses/>} />
      </Routes>

      

      <Toaster/>

     </div>
    </> 
  )
}

export default App
