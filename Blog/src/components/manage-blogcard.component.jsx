import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDay } from '../common/date'
import { revokeAccessToken } from 'firebase/auth'
import { UserContext } from '../App'
import axios from 'axios'
import Tag from './tags.component'

const BlogStatus = ({ stats }) => {

    return (
        <div className=' flex gap-2 max-lg:mb-6 max-lg:pb-6 border-grey max-lg:border-b'>
            {
                Object.keys(stats).map((key, i) => {
                    return !key.includes('parent') ? <div className={'flex flex-col items-center w-full h-full justify-center p-4 px-6' + (i != 0 ? "border-grey border-1" : '')} key={i}>
                        <h1 >{stats[key].toLocaleString()}</h1>
                        <p className='max-lg:text-dark-grey capitalize'>{key.split('_')[1]}</p>
                    </div> : ""
                })
            }
        </div>
    )


}
const ManagedPublishedBlog = ({ blog }) => {
    let { blog_id, title, des, publishedAt, activity } = blog
    let { userAuth: { access_token } } = useContext(UserContext)

    let [showState, setShowState] = useState(false)
    return (
        <>
            <div className='flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center'>
                {/* for img blank */}
                <div className='flex flex-col justify-between py-2 w-full in-w-[300px]'>
                    <div >
                        <Link to={`/blog/${blog_id}`} className='blog-title mb-4 shadow-2xl hover:underline hover:text-purple  cursor-pointer'>{title}</Link>
                        <p className='line-clamp-2 font-gelasio'>
                            {des.length ? des : 'No Description'}
                        </p>
                        <p className='line-clamp-1 mt-3'>published On {getDay(publishedAt)}</p>
                    </div>
                    <div className='flex gap-6 mt-4'>
                        <button className='btn-light border-l-grey shadow-2xl text-center hover:max-xl:m-2'>
                            <Link to={`/editor/${blog_id}`} className='pr-4 py-2 '>Edit</Link>
                        </button>

                        <button className='btn-light lg:hidden pr-2 border-r-dark-grey shadow hover:m-2' onClick={() => setShowState(preVal => !preVal)}>
                        status
                        </button>

                        <button className='btn-light pr-4 py-2 text-red shadow-2xl underline hover:max-xl:m-2' 
                        onClick={(e) => deleteBlog(blog, access_token, e.target)}>
                            Delete
                        </button>

                    </div>



                </div>

                <div className='max-lg:hidden'>
                    <BlogStatus stats={activity} />

                </div>

            </div>

            {
                showState ? <div className='lg:hidden'><BlogStatus stats={activity} /></div> : ''
            }
        </>
    )
}

export default ManagedPublishedBlog


const deleteBlog = (blog, access_token, target) => {
    let { index, blog_id, setStateFunc, } = blog

    target.setAttribute('disabled', true)

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/delete-blog', {
        blog_id
    }, {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    }).then(({ data }) => {
        target.removeAttribute('disabled')

        setStateFunc(preVal => {
            let { deleteDocCount, totalDocs, results } = preVal

            results.splice(index, 1)

            if(!deleteDocCount){
                deleteDocCount=0
            }

            if (!results.length && totalDocs - 1 > 0) {
                return null
            }
            return { ...preVal, totalDocs: totalDocs - 1, deleteDocCount: deleteDocCount + 1 }
        }).catch(err => {
                console.log(err);
            })
    }
    )
}


export const ManageDraftBlogPost = ({ blog}) => {
    let {index, title, des, blog_id } = blog
    let { userAuth: { access_token } } = useContext(UserContext)
    index++
    return (
        <div className='flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey'>
            <h1 className='blog-index text-center pl-4 md:pl-6 flex-none'>
                {index < 10 ? '0' + index : index}
            </h1>

            <div>
                <h1 className='blog-title mb-3 hover:max-xl:m-2 cursor-pointer'>{title}</h1>
                <p className='line-clamp-2 font-gelasio'>
                    {des.length ? des : 'No Description'}
                </p>
                <div className='flex gap-6 mt-3'>
                    <button className='btn-light border-l-grey shadow-2xl text-center hover:max-xl:m-2'>
                        <Link to={`/editor/${blog_id}`} className='pr-4 py-2 '>Edit</Link>
                    </button>


                    <button onClick={(e) => deleteBlog(blog, access_token, e.target)} className='btn-light pr-4 py-2 text-red shadow-2xl underline hover:max-xl:m-2'>
                        <Link className='pr-4 py-2 '>Delete</Link>
                    </button>

                </div>

            </div>
        </div>
    )
}