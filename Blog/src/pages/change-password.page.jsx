import React, { useContext, useRef } from 'react'
import AnimationWrapper from '../common/page-animation'
import InputBox from '../components/input.component'
//import { useParams } from 'react-router-dom'
import { Toaster, toast} from 'react-hot-toast'
import axios from 'axios'
import { UserContext } from '../App'

const ChangePassword = () => {

    let { userAuth: {access_token} } = useContext(UserContext)
     
    let ChangePasswordForm = useRef()
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    const handelSubmit = (e) =>{

        e.preventDefault()

        let form = new FormData(ChangePasswordForm.current)
        let formData ={ }

        for(let [key, value] of form.entries()){
            formData[key] = value
        }

        let { currentPassword, newPassword } = formData

        if(!currentPassword.length || !newPassword.length){
            return toast.error('Fill all the input')
        }
        if(!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)){
            return toast.error("password must be greter then  6 to 20 char but must be 1 small and 1 Capital letter and must 1 be Number ")
        }


        e.target.setAttribute('disabled', true);


        let loadingToast = toast.loading("Updating...")

        axios.post(import.meta.env.VITE_SERVER_DOMAIN  + '/change-password', formData, {
            headers:{
                'Authorization': `Bearer ${access_token}`
            }
        }).then(() =>{
            toast.dismiss(loadingToast)
            e.target.removeAttribute('disabled')
            return toast.success('password updated')
         })
        .catch(({ response }) =>{
             toast.dismiss(loadingToast)
             e.target.removeAttribute('disabled')
             return toast.error(response.data.error)
         })
    }
  return (


    <AnimationWrapper>

        <Toaster/>

        <form ref={ChangePasswordForm}>
            <h1 className='max-md:hidden'>Change Password</h1>
            <div className='py-10 w-full md:max-w-[400px]'>
                <InputBox name='currentPassword' type='password' placeholder='Current password' className='profile-edit-input' icon='fi-rr-unlock' />
                <InputBox name='newPassword' type='password' placeholder='New password' className='profile-edit-input' icon='fi-rr-unlock' />

                <button onClick={handelSubmit} className='btn-dark px-10 border-dark-grey mt-5'>
                    Change Password

                </button>
            </div>
        </form>
    </AnimationWrapper>
   
  )
}

export default ChangePassword