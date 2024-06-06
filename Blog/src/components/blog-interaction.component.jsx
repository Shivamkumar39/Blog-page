import React, { useContext, useEffect, useState } from 'react'
import { blogContext } from '../pages/blog.page'
import { Link } from 'react-router-dom'
import { UserContext } from '../App'
import { Toaster, toast } from 'react-hot-toast'
import axios from 'axios'
const BlogInteration = () => {

  
  let {userAuth: {username, access_token}} = useContext(UserContext)
  let {blog, blog: {_id, title, blog_id, activity, activity: { total_likes , total_comments }, author: { personal_info: {username: author_username}}}, setBlog, isLikeByuser, setisLikeByuser} =  useContext(blogContext)
  
 
  useEffect(() =>{
    if(access_token){
      axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/isliked-by-user', {_id }, {
        headers:{
          'Authorization': `Bearer ${access_token}`
        }
      }).then(({data: {result}}) =>{
       setisLikeByuser(Boolean(result))
      }).catch(err =>{
        console.log(err)
      })
    }
  }, [])

  const handleLike = () =>{
  
    if(access_token){
      setisLikeByuser(preVal => !preVal)

      !isLikeByuser ? total_likes++ : total_likes--;

      setBlog({...blog, activity:{...activity, total_likes}})

      axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/like-blog', {
        _id, isLikeByuser
      }, {
        headers:{
          'Authorization': `Bearer ${access_token}`
        }
      }).then(({data}) =>{
        console.log(data)
      }).catch(err =>{

      })
    }
    else{
      toast.error("please login like this blog")
    }
  }
  return (
    <>

    <Toaster/>
    <hr className='border-grey my-2'/>
        <div className='flex gap-6 justify-between'>
           <div className='flex gap-4 items-center'>
        
                <button onClick={handleLike} className={'w-10 h-10  rounded-full flex items-center justify-center ' + ( isLikeByuser ? 'bg-red/20 text-red' : "bg-grey/80")}> <i className={"fi " + (isLikeByuser ? "fi-sr-heart" : "fi-rr-heart")}></i></button>
                <p className='txet-xl text-dark-grey'>Like {total_likes}  </p>
        

            
                <button className='w-15 h-15  rounded-full flex items-center justify-center'> <i className="fi fi-rr-comment-alt"></i></button>
                <p className='txet-xl text-dark-grey'>{total_comments}  </p>
         

            
            {/* social link */}
            <div className='flex gap-3 ml-3 pl-3 pt-2 pb-2 pr-3 bg-dark-grey/30 border-2'>
                <Link to="https://github.com/Shivamkumar39?tab=repositories"> <button className='w-15 h-15  rounded-full flex items-center justify-center' > <i className="fi fi-brands-linkedin hover:text-twitter"></i></button></Link>
                <Link to="https://github.com/Shivamkumar39?tab=repositories"> <button className='w-15 h-15   rounded-full flex items-center justify-center' > <i className="fi fi-brands-github"></i></button></Link>
                <Link to="https://github.com/Shivamkumar39?tab=repositories"> <button className='w-15 h-15  rounded-full flex items-center justify-center' > <i className="fi fi-brands-twitter hover:text-twitter"></i></button></Link>
                <p className=''>Visit My profile</p>
            </div>
          
           </div>
           
           <div className='flex gap-6 items-center'>

            {
              username == author_username ? <Link to={`/editor/${blog_id}`} className='underline hover:text-purple'>Edit</Link> : " "
            }
            <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`} ><i className="fi fi-brands-twitter hover:text-twitter"></i></Link>
           </div>

        </div>
    <hr className='border-grey my-2'/>    
    
    </>
  )
}

export default BlogInteration