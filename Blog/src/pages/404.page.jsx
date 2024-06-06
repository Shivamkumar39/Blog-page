import React from 'react'
import pageNotFoundImg from '../imgs/404.png'
import { Link } from 'react-router-dom'
import logo from '../imgs/logo.png'
const PageNotFound = () => {
  return (
    <section className='h-cover relative p-10 flex flex-col items-center gap-20 text-center'>
        <img src={pageNotFoundImg} className='select-none border-2 border-white w-72 aspect-square object-cover rounded ' />
        <h1 className='text-3xl font-serif'>Page not Found !</h1>
        <p>The page you are looking for does not exist. Head back to <Link to='/' className='text-red text-xl'>Home Page</Link>  </p>


        <div className='mt-auto'>
          <Link to='/'> <img src={logo} className='h-25 w-25 object-contain block mx-auto select-none'></img></Link>
            <p className='mt-5 text-dark-grey'>Read Millions of Study material</p>
        </div>
    </section>
  )
}

export default PageNotFound