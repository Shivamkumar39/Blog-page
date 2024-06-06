import React, { useContext, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import logo from '../imgs/logo.png'
import AnimationWrapper from '../common/page-animation'
//import defaultBanner from '../imgs/blog banner.png'
//import { uploadImage } from '../common/aws'
import { Toaster, toast } from 'react-hot-toast'
import { EditerContext } from '../pages/editor.pages'
import EditorJS from '@editorjs/editorjs'
import { tools } from "./tools.component"
import axios from 'axios'
import { UserContext } from '../App'


const BlogEditor = () => {

    let { blog, blog: { title, content, tags, des }, setBlog, textEditor, setTextEditor, setEditerState } = useContext(EditerContext)

    let { userAuth: { access_token } } = useContext(UserContext)
    let navigate = useNavigate()
    let { blog_id } = useParams()

    //usereffect for description
    useEffect(() => {
        if (!textEditor.isReady) {
            setTextEditor(new EditorJS({
                holderId: "textEditor",
                data: Array.isArray(content) ? content[0] : content,
                tools: tools,
                placeholder: 'lets write an awesome blog',

            }))
        }
        // console.log(blog);
    }, [])



    //for uploading img this all doing code

    //   const handleBannerUpload = (e) =>{
    //       let img = e.target.files[0]

    //       if(img)
    //          // let loadingtoast = toast.loading("Uploding........")

    //           uploadImage(img).then((url) =>{
    //               if(url){
    //                   toast.dismiss(loadingtoast)
    //                   toast.success("Uploaded 👍")


    //                     setBlog({...blog, banner: url })


    //               }
    //           }).catch(err =>{
    //               toast.dismiss(loadingtoast)
    //               return toast.error
    //           })
    //       }

      

    //   const handleError = (e)=>{
    //     let img = e.target

    //       img.src = defaultBanner;

    //   }

    //For Title


    const handleTitleKeyDown = (e) => {
        if (e.keyCode == 20) {
            e.preventDefault()
        }
    }

    const handleTitleChange = (e) => {
        let input = e.target
        input.style.height = 'auto'
        input.style.height = input.scrollHeight + 'px';

        setBlog({ ...blog, title: input.value })
    }

    //publish button
    const handlePublishEvent = () => {
        // if(banner.length){ //(!banner.length)
        //     return toast.error("upload  or without banner you  publish blog")
        // }
        if (!title.length) {
            return toast.error("without title don't uploaded blog ⚠️ please provide title ")
        }

        if (textEditor.isReady) {
            textEditor.save().then(data => {
                if (data.blocks.length) {
                    setBlog({ ...blog, content: data })
                    setEditerState("publish")
                } else {
                    return toast.error("write somthing for publish a blog")
                }
            })
        }
    }

    const handledarfbtn = (e) => {
        if (e.target.className.includes("disable")) {
            return;
        }

        if (!title.length) {
            return toast.error("write blog title before then save to Darf")
        }

        let loadingToast = toast.loading("saving to draft....");

        e.target.classList.add('disable');


        if (textEditor.isReady) {
            textEditor.save().then(content => {

                let blogObj = {
                    title, tags, des, content, draft: true
                }
                //let createblog = '/create-blog'
                axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/create-blog', { ...blogObj, id: blog_id }, { //'http://localhost:6500'
                    headers: {
                        'Authorization': `Bearer ${access_token}`

                    }
                }).then(() => {
                    e.target.classList.remove('disable')

                    toast.dismiss(loadingToast)
                    toast.success("published 👍")

                    setTimeout(() => {
                        navigate("/")
                    }, 1000);
                })
                    .catch((error) => {
                        e.target.classList.remove('disable');
                        console.log(error)
                        toast.dismiss(loadingToast);
                        toast.error(error.response?.data?.error || "An error occurred while publishing");
                    });

            })
        }


    }



    return (
        <>

            <nav className='navbar'>
                <Link to='/' className='flex-none w-10'>
                    <img src={logo} />
                </Link>

                <p className='max-md:hidden text-black line-clamp-1 w-full'>
                    {title.length ? title : " Creating New blog"}

                </p>

                <div className='flex gap-4 ml-auto'>
                    <button className='btn-dark py-2 ' onClick={handlePublishEvent}>
                        Publish
                    </button>
                    <button className='btn-light py-2' onClick={handledarfbtn}>
                        save Darf
                    </button>
                </div>

            </nav>
            <Toaster />
            <AnimationWrapper>
                <section>
                    <div className='mx-auto max-w-[900px] w-full'>

                        {/* for image */}
                         {/*  <div className='relative aspect-video bg-white border-4 border-grey hover:opacity-80'>
                       <label htmlFor='uploadBanner'>
                            {/* <img src={banner} className='z-20' onError={handleError} /> 
                            <input id='uploadBanner' type='file' accept='.png , .jpg , .jpeg' hidden onChange={handleBannerUpload}>
                            </input>
                        </label> 


                    </div>*/} 


                        <textarea defaultValue={title} placeholder='Blog Title' className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-grey' onKeyDown={handleTitleKeyDown} onChange={handleTitleChange}>

                        </textarea>

                        <hr className='w-full opacity-10 my-5' />

                        <div className="p-4 mb-4 text-sm text-black-800 rounded-lg bg-twitter dark:bg-gray-800 dark:text-blue-400" role="alert">
                            <span className="font-medium text-red ">Info alert!</span> ⚠️⚠️ Only Link accept for Image In Blog ⚠️
                        </div>


                        <div id='textEditor' className='font-gelasio'>

                        </div>

                    </div>
                </section>
            </AnimationWrapper>

        </>




    )
}
export default BlogEditor