import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AnimationWrapper from '../common/page-animation'
import Loader from '../components/loader.component'
import { Link } from 'react-router-dom'
import { getDay } from '../common/date'
import BlogInteration from '../components/blog-interaction.component'
import { createContext } from 'react'
import BlogPostCard from '../components/blog-post.component'
import BlogContent from '../components/blog-content.component'


export const blogStructure = {
    title: '',
    des: '',
    content: [],
    tags: [],
    author: { personal_info: { }},
    publishedAt: ''
}


export const blogContext = createContext({ })


const BlogPage = () => {

    let { blog_id } = useParams()
    
    const [blog, setBlog] = useState(blogStructure)

    let [similarBlogs, setSimilerBlogs] = useState(null)
    let [isLikeByuser, setisLikeByuser] = useState(false)
    const [loading, setLoading] = useState(true)

    let { title, content, author: {personal_info:{fullname, username: author_username , profile_img}},  publishedAt, } = blog
    
    
    const fetchBlog = () =>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/get-blog', {
            blog_id
        }).then(({data: {blog}}) =>{
            setBlog(blog)  
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/search-blogs', {
                tag: blog.tags[0], limit: 3, eliminate_blog: blog_id
            }).then(({data})=>{
                setSimilerBlogs(data.blogs)
            })
            
            setLoading(false)
        }).catch(err =>{
            console.log(err)
            setLoading(false)
        })
    }

    useEffect(() =>{

        resetState()
        fetchBlog()
    }, [blog_id])

    const resetState = () =>{
        setBlog(blogStructure)
        setSimilerBlogs(null)
        setLoading(true)
    }
  return (
    <AnimationWrapper>
        {
            loading ? <Loader/>
            :
              <blogContext.Provider value={{ blog, setBlog, isLikeByuser, setisLikeByuser}}>
             <div className='max-w-[900px] center py-10 max-lg:px-[5vw]'>

                {/* <img src={banner} className='aspect-video'/> */}

                <div className='mt-12'>
                    <h1 className='text-2xl text-dark'>
                        {title}
                    </h1>

                    <div className='flex max-sm:flex-col justify-between my-8'>
                       <div className='flex gap-5 items-start'>
                        <img src={profile_img} className='w-12 h-12 rounded-full'/>

                        <p className='capitalize'>{fullname}
                        <Link to={`/user/${author_username}`} className>@{author_username}</Link>
                        </p>

                       </div>
                    </div>

                    <p className='text-dark opacity-75 mx-sm:mt-6 max-sm:ml-12 max-sm:pl-5'>Published On{getDay(publishedAt)}</p>

                </div>

                <BlogInteration />
                {/* content hear */}
                 <div className='my012 font-gelasio blog-page-content'>
                   {
                    content[0].blocks.map((block, i) =>{
                        return <div key={i} className='my-4 md:my-8'>
                            <BlogContent block={block}/>
                            </div>
                    })
                   }
                 </div>

                <BlogInteration/>

                {
                    similarBlogs != null && similarBlogs.length ? <>

                    <h1 className='text-2xl mt-14 mb-10 font-medium'>Similar Blog</h1>
                    {
                        similarBlogs.map((blog, i) =>{
                            let {author : {personal_info}} = blog
                            return <AnimationWrapper key={i} transition={{duration: 1, delay: i*0.1}}>
                                <BlogPostCard content={blog} author={personal_info}/>
                            </AnimationWrapper>
                        })
                    }
                    </>  : ""
                }

            </div>
            </blogContext.Provider>
            
        }
    </AnimationWrapper>
  )
}

export default BlogPage