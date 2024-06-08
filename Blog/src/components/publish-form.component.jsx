import toast, { Toaster } from "react-hot-toast"
import AnimationWrapper from "../common/page-animation"
import { useContext } from "react"
import { EditerContext } from "../pages/editor.pages"
import Tag from "./tags.component"
import axios from "axios"
import { UserContext } from "../App"
import { useNavigate, useParams } from "react-router-dom"

const PublishForm = () => {

    let characterlimit = 200;
    let tagLimit = 10;

    let { blog_id } = useParams()
    let { blog, blog: { title, tags, des, content }, textEditor, setEditerState, setBlog } = useContext(EditerContext);

    let { userAuth: { access_token } } = useContext(UserContext)


    let navigate = useNavigate()

    const handleCloseEvent = () => {
        setEditerState('editor')
    }

    //update title
    const handleBlogTitleChange = (e) => {
        let input = e.target
        setBlog({ ...blog, title: input.value })
    }

    //update description
    const handleBlogDesChnage = (e) => {
        let input = e.target
        setBlog({ ...blog, des: input.value })
    }

    const handleTitleKeyDown = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault()
        }
    }


    const handlekeydowninput = (e) => {
        if (e.keyCode == 13 || e.keyCode == 188) {
            e.preventDefault()

            let tag = e.target.value

            if (tags.length < tagLimit) {
                if (!tags.includes(tag) && tag.length) {
                    setBlog({ ...blog, tags: [...tags, tag] })
                }
            } else {
                toast.error(`you can added max ${tagLimit} tags`)
            }
            e.target.value = "";
        }
    }

    const publishBlog = (e) => {

        if (e.target.className.includes("disable")) {
            return;
        }

        if (!title.length) {
            return toast.error("write blog title before publishing")
        }
        if (!des.length || des.length > characterlimit) {
            return toast.error("write a description about you blog under 200")

        }
        if (!tags.length) {
            return toast.error("Enter a tags for rank your blog ")
        }

        let loadingToast = toast.loading("Publishing....");

        e.target.classList.add('disable');

        let blogObj = {
            title, tags, des, content, draft: false
        }

        console.log(blogObj);
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
                navigate("/dashboard/blogs")
            }, 1000);
        })
            .catch((error) => {
                e.target.classList.remove('disable');
                console.log(error)
                toast.dismiss(loadingToast);
                toast.error(error.response?.data?.error || "An error occurred while publishing");
            });

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
                        navigate("/dashboard/blogs?tab=draft")
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
        <AnimationWrapper>
            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
                <Toaster />

                <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[8%]"
                    onClick={handleCloseEvent}>
                    <i className="fi fi-br-cross-small"></i>
                </button>

                <div className="max-w-[550px] center">
                    <p className="text-dark-grey mb-1">Preview</p>

                    {/* <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
                    <img src={banner} />
                </div> */}

                    <h1 className="text-4xl font-medium mt-2 leading-tight font-serif line-clamp-1">{title}</h1>

                    <p className="font-serif line-clamp-2 text-xl leading-7 mt-4">{des}</p>
                </div>

                <div className="border-grey lg:border-1 lg:pl-8">
                    <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
                    <input type="text" placeholder="Blog Title" defaultValue={title} className="input-box pl-4" onChange={handleBlogTitleChange} />


                    <p className="text-dark-grey mb-2 mt-9">Short Discription about your blog</p>

                    <textarea maxLength={characterlimit} defaultValue={des} className="h-40 resize-none font-serif leading-7 input-box pl-4" onChange={handleBlogDesChnage} onKeyDown={handleTitleKeyDown}></textarea>
                    <p className="mt-1 text-dark-grey text-sm text-right">{characterlimit - des.length} character left</p>

                    <p className="text-dark-grey mb-2 mt-9">Topics - (helps is searching and ranking you blog post )</p>

                    <div className="relative input-box pl-2 py-2 pb-4">
                        <input type="text" placeholder="Topics" className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 font-serif focus:bg-white" onKeyDown={handlekeydowninput} />

                        {tags.map((tag, i) => {
                            return <Tag tag={tag} tagIndex={i} key={i} />
                        })}

                        <p className="mt-1 mb-4 text-right font-serif ">{tagLimit - tags.length} Tags Left</p>


                    </div>
                    <button className="btn-dark px-8 "
                        onClick={publishBlog}>
                        publish
                    </button>
                    <button className='btn-light py-2' onClick={handledarfbtn}>
                        save Darf
                    </button>
                </div>

            </section>
        </AnimationWrapper>
    )
}
export default PublishForm