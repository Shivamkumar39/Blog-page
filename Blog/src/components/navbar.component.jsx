import React, { useContext, useEffect, useState } from 'react'
import logo from '../imgs/logo.png'
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import UserNavigationPanel from './user-navigation.component'
import axios from 'axios'



const Navbar = () => {


  const [searchVisibility, setSerchVisibility] = useState(false)
  const [userNavPanel, setUserNavPanel] = useState(false)
  let Navigate = useNavigate()

  const { userAuth, userAuth: { access_token, profile_img, new_notification_available }, setuserAuth } = useContext(UserContext);

  useEffect(() => {
    axios.get(import.meta.env.VITE_SERVER_DOMAIN + '/notification', {
      headers: {
        'Authorization': 'Bearer ${access_token}'
      }
    }).then(({ data }) => {
      setuserAuth({ ...userAuth, ...data })


    }).catch(err => {
      console.log(err);
    })
  }, [access_token])

  const handleUserNavPanel = () => {
    setUserNavPanel(currentVal => !currentVal);
  }

  // const handleBlur = () =>{
  //   setTimeout(() =>{
  //     setUserNavPanel(false)
  //   }, 100);

  //}

  const handlesearchfun = (e) => {
    let query = e.target.value

    if (e.keyCode == 13 && query.length) {
      Navigate(`/search/${query}`)
    }
  }


  return (
    <>
      <nav className='navbar z-50'>


        {/* //logo place        */}
        <Link to='/' className='flex-none w-10'>
          <img src={logo} className='w-full' />
        </Link>

        {
          new_notification_available
        }

        {/* //search icon       */}
        <div className={'absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ' + (searchVisibility ? "show" : "hide")}>
          <input type='text' placeholder='Search' className='w-full md:w-auto bg-grey p-4 pl-6 pr-[12%]  md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12' onKeyDown={handlesearchfun} />
          <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-black"></i>
        </div>

        {/* //right side icons place        */}
        <div className='flex items-center gap-3 md:gap-6 ml-auto'>
          <button className='md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center' onClick={() => setSerchVisibility(currentVal => !currentVal)}>
            <i className="fi fi-br-search"></i>
          </button>

          {/* //editer       */}
          <Link to='/editor' className='hidden md:flex gap-2 link'>
            <i className="fi fi-rr-edit"></i>
            <p>Write</p>
          </Link>

          {
            access_token ?
              <>
                <Link to='/dashboard/notification'>
                  <button className='w-12 h-12 rounded-full bg-grey relative hover:bg-black/10'>
                    <i className="fi fi-rs-bell text-2xl mt-1"></i>
                    {
                      new_notification_available ? <span className='bg-red w-3 h-3 rounded-full absolute  z-10 top-2 right-2'></span> : ""
                    }
                    
                  </button>

                </Link>

                <div className='relative' onClick={handleUserNavPanel}>  {/*// onBlur={handleBlur} */}
                  <button className='w-12 h-12 mt-1'>
                    <img src={profile_img} className='w-full h-full object-cover rounded-full' />
                  </button>

                  {
                    userNavPanel ? <UserNavigationPanel /> : ""
                  }



                </div>
              </>
              :
              <>
                {/* //signin        */}
                <Link className='btn-dark py-2 ' to='/signin'>
                  sign In
                </Link>

                {/* //signup        */}
                <Link className='btn-light py-2 hidden md:block ' to='/signup'>
                  sign Up
                </Link>
              </>
          }



        </div>


      </nav>

      <Outlet />
    </>
  )
}

export default Navbar