import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BACKEND_URL } from '../utils/utils'


const Buy = () => {
  const { courseId } = useParams()
  const [loading, setloading] = useState(false)

  const [course, setcourse] = useState([])//having a response from backend of course,clientsecret
  const [clientsecret, setclientsecret] = useState("")
  const [error, seterror] = useState("")

  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))//GETTING TOKEN FROM  LOCALSTORAGE 
  const token = user.token

  const stripe = useStripe();//from stripe
  const elements = useElements();
  const [carderror, setcarderror] = useState("")

  useEffect(
    () => {
      const fetchBuyCourseData = async () => {
        if (!token) {
          toast.error("pls login to purchase the course")
          return
        }
        try {
          setloading(true)
          const response = await axios.post(`${BACKEND_URL}/course/buy/${courseId}`, {}, {

            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true
          }
          )
          // console.log(response.data)
          setcourse(response.data.course)
          setclientsecret(response.data.clientSecret)
          setloading(false)
        } catch (error) {
          setloading(false)
          if (error?.response?.status == 400) {
            seterror("you have already purchased this course")
            // navigate("/purchase")
          }
          else {
            seterror(error?.response?.data?.errors)
          }
        }

      }
      fetchBuyCourseData()
    }, [courseId])


  const handlePurchase = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("stripe or element not found")
      return;
    }
    setloading(true)
    const card = elements.getElement(CardElement);

    if (card == null) {
      console.log("card elemnt is not found")
      setloading(false)
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.log('Stripe paymentMethod error', error);
      setloading(false)
      setcarderror(error.message)
    } else {
      console.log('PaymentMethod created', paymentMethod);
    }
    if (!clientsecret) {
      console.log("clientSecret not found")
      return;
    }
    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
      clientsecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: user?.user?.firstName,
          email: user?.user?.email,
        },
      },
    })
    if (confirmError) {
      setcarderror(confirmError.message)
    }
    else if (paymentIntent.status === "succeeded") {
      console.log("Payment succeeded", paymentIntent)
      console.log("your payment id", paymentIntent.id)
      const payment_info = {
        email: user?.user?.email,
        userId: user?.user?._id,
        courseId: courseId,
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,

      }
      console.log("payment info:", payment_info)
        await axios.post(`${BACKEND_URL}/order`, payment_info,
        {
       headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }).then((response)=>{
        console.log(response.data)
        toast.success("Payment successful")
      }).catch((error)=>{
        console.log(error)
        toast.error("error in making payment")
        console.log("error in making payment")
      })
    
    navigate("/purchase")
  }
    setloading(false)
}

return (
  <>
    {error ? (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
          <p className="text-lg font-semibold">{error}</p>

          <Link
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
            to={"/purchase"}
          >
            Go to Purchases
          </Link>
        </div>
      </div>
    ) : (
      <div className="flex flex-col sm:flex-row my-40 container mx-auto">
        <div className="w-full mx-[20vw] mb-30 sm:mx-0  md:w-1/2 ">
          <h1 className="text-xl font-semibold underline mx-auto">Order Details</h1>
          <div className="flex items-center text-center space-x-2 mt-4">
            <h2 className="text-gray-600 text-sm">Total Price</h2>
            <p className="text-red-500 font-bold">${course.price}</p>
          </div>
          <div className="flex items-center text-center space-x-2">
            <h1 className="text-gray-600 text-sm">Course name</h1>
            <p className="text-red-500 font-bold">{course.title}</p>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">
              Process your Payment!
            </h2>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm mb-2"
                htmlFor="card-number"
              >
                Credit/Debit Card
              </label>
              <form onSubmit={handlePurchase}>
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />

                <button
                  type="submit"
                  disabled={!stripe || loading} // Disable button when loading
                  className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                >
                  {loading ? "Processing..." : "Pay"}
                </button>
              </form>
              {carderror && (
                <p className="text-red-500 font-semibold text-xs">
                  {carderror}
                </p>
              )}
            </div>

            <button className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center">
              <span className="mr-2">🅿️</span> Other Payments Method
            </button>
          </div>
        </div>
      </div>
    )}
  </>
)
}

export default Buy
