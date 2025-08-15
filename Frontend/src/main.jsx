import React from 'react';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";


const stripePromise = loadStripe("pk_test_51RJ9F3GavZviEVMJCLNvVOdu6kYklV2oIL9TTva2hDLVXkM08xbLicsVer26lQYyDRv5M4ZKn1siGDmrwdHB2Rcx00BEOSzHrN")
createRoot(document.getElementById('root')).render(
   <Elements  stripe={stripePromise}>
           <BrowserRouter>
    <App />
  </BrowserRouter>
          </Elements>
  
)
