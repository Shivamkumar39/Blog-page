import React, { useContext, useRef } from 'react'
import InputBox from '../components/input.component'
import googleicon from '../imgs/google.png'
import { Link, Navigate, json } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'
import { storeInsession } from '../common/session';
import { UserContext } from '../App';
import { authWithGoogle } from '../common/firebase'

const UserAuthForm = ({ type }) => {

    const authForm =  useRef();

    let {userAuth: {access_token}, setUserAuth} = useContext(UserContext)

    const UserAuthThroughServer = (serverRoute, formData) => {

        axios.post('http://localhost:6500' + serverRoute, formData)
        .then(({ data }) => {
            storeInsession("user", JSON.stringify(data))
            setUserAuth(data)
            
        }).catch(({response})=>{
            toast.error(response.data.error)
            
        })
    }

    const handleSubmit = (e) => {


        e.preventDefault();

        let serverRoute = type == "sign-in" ? "/signin" : "/signup";

         let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
         let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


       
         //getdata for db
         let form = new FormData(authForm.current);
         let formData = {};

        for(let [key, value] of form.entries()){
            formData[key] = value;
         }

        
         let {fullname, email, password} = formData;
         //form validation
        if(fullname){
            if( fullname.length < 3){
                return toast.error("Fullname must be grater then 3")
            }
        }
        if(!email.length){
             return toast.error( "Enter correctemail ")
    
        }
        if(!emailRegex.test(email)){
            return toast.error( "Email is invalid cheak email")
        }
        if(!passwordRegex.test(password)){
            return toast.error("password should be 6 to 16 characters long with a numeric, 1 lowercase and 1 uppercase letters")
        }


        UserAuthThroughServer(serverRoute, formData)

        
    }

    const handleGoogleAuth = (e)=>{
        e.preventDefault();

        authWithGoogle().then(user =>{
        let serverRoute = '/google-auth'
        let formData = {
            access_token: user.accessToken
        }
        UserAuthThroughServer(serverRoute, formData)


       }).catch(err =>{
        toast.error('trouble login with google')
        return console.log(err)
       })

    }
  return (
    access_token ?
    <Navigate to="/"/>
      :
        <section className='h-cover flex items-center justify-center'>
            <Toaster />
        <form ref={authForm} className='w-[80%] max-w-[400px]'>
            <h1 className='text-4xl font-gelasio capitalize text-center  mb-24'>
                {type == "sign-in" ? "welcome back" : "join us today" }
            </h1>

            {
                type != "sign-in" ? 
                <InputBox name="fullname"
                           type="text"
                           placeholder="Full name"
                           icon="fi-rr-user"/> 
                           : ""
            }
            <InputBox name="email"
                     type="email"
                     placeholder="Email"
                     icon="fi-sr-at"/>

             <InputBox name="password"
                     type="password"
                     placeholder="Password"
                     icon="fi-rr-key"/>        
            
            <button className='btn-dark center mt-14' type='submit'
                onClick={handleSubmit} 
                >
                { type.replace("-", " ") }
            </button>

            <div className='relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold'>
                <hr className='w-1/2 border-black' />
                <p>or</p>
                <hr className='w-1/2 border-black' />
            </div>


            <button className='btn-dark flex items-center justify-center gap-4 w-[90%] center' onClick={handleGoogleAuth}>
                <img src={googleicon} className='w-5' />
                Continue with google
            </button>

            {
                type == "sign-in" ? <p className='mt-6 text-dark-grey text-xl text-center'>Don't have account ?<Link to="/signup" className="underline text-dark text-xl ml-1"> Join Us Today</Link> </p> : 
                <p className='mt-6 text-dark-grey text-xl text-center'> Already a member ?<Link to="/signin" className="underline text-blue text-xl ml-1"> Sign in here </Link> </p>
            }

        </form>

        </section>

  )
}

export default UserAuthForm