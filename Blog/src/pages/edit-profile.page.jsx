import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../App'
import axios from 'axios'
import { profileDataStructure } from './profile.page'
import AnimationWrapper from '../common/page-animation'
import Loader from '../components/loader.component'
import { Toaster, toast } from 'react-hot-toast'
import InputBox from '../components/input.component'
import { uploadImage } from '../common/firebase'
import { json } from 'react-router-dom'
import {storeInsession} from '../common/session'
const EditProfile = () => {

  let bioLimit = 150

    //refrence for img

    let profileImage = useRef()
    let Editprofilepage = useRef()
  
  //let { personal_info: { fullname, username: profile_username, profile_img, email, bio, }, social_links} = profile

  let { userAuth, userAuth: { access_token }, setUserAuth} = useContext(UserContext)
  let [profile, setprofile] = useState(profileDataStructure)

  
   let { personal_info: { fullname, username: profile_username, profile_img, email, bio, }, social_links } = profile

  const [loading, setLoading] = useState(true)
  const[characterLeft, setcharacterLeft] = useState(bioLimit)
  const [updatedProfileImg, setupdatedProfileImg] = useState(null)



  useEffect(() => {
    if (access_token) {
      axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/get-profile', {
        username: userAuth.username
      }).then(({ data }) => {
        setprofile(data)
        setLoading(false)
      }).catch(err => {
        console.log(err)
      })
    }
  }, [access_token])


  const handleChangeCharater = (e) =>{
    setcharacterLeft(bioLimit - e.target.value.length)
  }


  const handleImagePrview = (e)=>{
    let img = e.target.files[0]
    profileImage.current.src = URL.createObjectURL(img)

    setupdatedProfileImg(img)
  }
  
  const handelUploadImg = (e) =>{
     e.preventDefault()
    if(updatedProfileImg){
      const loadingToast = toast.loading('uploading...');
      e.target.setAttribute('disabled', true)

      uploadImage(updatedProfileImg)
      .then(url =>{
        

        if(url){
          axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/update-profile-img', {
            url
          }, {
            headers:{
              'Authorization':`Bearer ${access_token}`
            }
          }).then(({data}) =>{
            const newUserAuth = {...userAuth, profile_img: data.profile_img }

            storeInsession('user', JSON.stringify(newUserAuth))
            setUserAuth(newUserAuth)

            setupdatedProfileImg(null)

            toast.dismiss(loadingToast)
            e.target.removeAttribute('disable')
            toast.success('uploading...')
            console.log(data);
          }).catch((error) =>{
            toast.dismiss(loadingToast)
            e.target.removeAttribute('disable')
            console.log(error);
          })
        }

      



      }).catch(err  =>{
        console.log(err);
        console.log("from first");
      })
    }
  }

  const handleSubmitProfile = (e) => {
    e.preventDefault()

    let form = new FormData(Editprofilepage.current)
    let formData = { }

    for(let [key, value] of form.entries()){
      formData[key] = value
    }

   
    let { username, bio,  youtube, twitter, github, website, linkedin} = formData

      if(username.length < 3){
        return toast.error("Username should be at least 3 letter long")
       }
       if(bio.length > bioLimit){
        return toast.error("bio must be less then 150 char")
       }

       let loadingToast = toast.loading('uploading...');
       e.target.setAttribute('disable', true)

      

       axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/update-profile', {
        username, bio, 
      social_links: {youtube, twitter, github, website, linkedin }
       },
       {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
  
        
      }).then(({ data }) => {
      if(userAuth.username != data.username){
        let newUserAuth = { ...userAuth, username: data.username, bio:data.bio}
        storeInsession('user', JSON.stringify(newUserAuth))
        setUserAuth(newUserAuth)
        console.log(bio);
      }



      toast.dismiss(loadingToast);
      e.target.removeAttribute("disabled")
      toast.success("profile Updated")

    }).catch(({ response }) => {
      toast.dismiss(loadingToast);
      e.target.removeAttribute("disabled")
      toast.error(response.data.error);
      
    });
  };


  //Ensure profile is always properly structured
  //let { personal_info: { fullname, username: profile_username, profile_img, email, bio, }, social_links} = profile;
 



  return (
    <AnimationWrapper>

      {
        loading ? <Loader /> :
          <form ref={Editprofilepage}>
            <Toaster />
            <h1 className='max-md:hidden'>Edit Profile</h1>
            <div className='flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10'>
              <div className='max-lg:center mb-5 '>
                <label htmlFor='uploadImg' id='profileImgLable' className='relative block w-48 h-48 bg-grey rounded-full overflow-hidden max-lg:center'>
                  <div className='w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/80 opacity-0 hover:opacity-100 cursor-pointer'>Upload Image</div>
                  <img ref={profileImage} src={profile_img}  alt='profile'/>

                </label>
                <input onChange={handleImagePrview} type='file' id='uploadImg' accept='.jpeg, .png, .jpeg ' hidden />


                <button className='btn-light mt-5 max-lg:center lg:w-full px-10 m-2' onClick={handelUploadImg}>Upload</button>

                <div className='w-full'>
                  <div className='grid grid-cols-1 md:grid-cols-2 md:gap-5'>
                    <div>
                      <InputBox name='fullname' type='text' value={fullname} placeholder='Full Name' disable={true} icon='fi-rr-user' />
                    </div>

                    <div>
                      <InputBox name='email' type='email' value={email} placeholder='Email' disable={true} icon='fi-sr-envelope' />
                    </div>
                  </div>


                 <InputBox text='text' name='username' value={profile_username} placeholder='UserName' icon='fi-rr-at' />
                 <p className='text-dark-grey -mt-3'>Username will use to search user and will be visible to all users</p>

                 <textarea name='bio' maxLength={bioLimit} defaultValue={bio} className='input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5'  placeholder='Bio' onChange={handleChangeCharater} ></textarea>

                 <p className='text-dark-grey mt-1'>{characterLeft} character Left</p>

                 <p className='my-6 text-dark-grey'>Add Your social handle</p>
                 <div className='md:grid md:grid-cols-2 gap-x-6'>
                  {
                    Object.keys(social_links).map((key, i) =>{
                      let link = social_links[key];


                      return <InputBox key={i} name={key} type='text'value={link} placeholder='https://' icon={"fi " + (key != 'website' ? "fi-brands-" + key : "fi-rr-globe")}/>
                    })
                  }
                 </div>


                 <button className='btn-dark w-auto px-10 ' type='submit' onClick={handleSubmitProfile} >Update</button>
                </div>
              </div>
            </div>
          </form>
      }


    </AnimationWrapper>
  )
}

export default EditProfile