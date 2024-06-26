import React, { useContext, useEffect, useRef, useState } from 'react'
import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { UserContext } from '../App'

const SideNav = () => {


  let { userAuth: { access_token, new_notification_available, isAdmin } } = useContext(UserContext)
  const location = useLocation();
  const page = location.pathname.split('/')[2];

  let [pageState, setpageState] = useState(page.replace('-', ' '))
  let [showSideNav, setShowSideNav] = useState(false)

  const activeTabLine = useRef();
  const sideBarIcon = useRef();
  const PageStateTab = useRef();

  const changepagestate = (e) => {

    let { offsetWidth, offsetLeft } = e.target;

    activeTabLine.current.style.width = `${offsetWidth}px`;
    activeTabLine.current.style.left = `${offsetLeft}px`;

    if (e.target === sideBarIcon.current) {
      setShowSideNav(true);
    } else {
      setShowSideNav(false);
    }

  }

  useEffect(() => {
    setShowSideNav(false)
    PageStateTab.current.click()
  }, [pageState])
  return (

    access_token === null ? (<Navigate to='/signin' />) :
      (<>

        <section className='relative flex gap-10 py-0 m-0 max-md:flex-col'>

          <div className='sticky top-[80px] z-30'>


            <div className='md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto'>
              <button ref={sideBarIcon} className='p-5 capitalize' onClick={changepagestate}>
                <i className="fi fi-br-align-justify pointer-events-none"></i>
              </button>

              <button ref={PageStateTab} className='p-5 capitalize' onClick={changepagestate}>
                {pageState}
              </button>

              <hr ref={activeTabLine} className='absolute bottom-0 duration-500' />

            </div>
            <div className={`min-w-[200px] h-[calc(100vh-80px-60)] md:h-cover  md:sticky top-24 overflow-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 
          ${!showSideNav ? 'max-md:opacity-0 max-md:pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
              <h1 className='text-xl text-dark mb-3'>DashBoard</h1>
              <hr className='border-grey/60 -ml-6 mb-8 mr-6' />

              <NavLink to='/dashboard/blogs' onClick={(e) => setpageState(e.target.innerText)} className='sidebar-link'>
                <i className="fi fi-rr-document"></i>
                Blogs
              </NavLink>

              <NavLink to='/dashboard/notifications' onClick={(e) => setpageState(e.target.innerText)} className='sidebar-link'>
                <div className='relative'>
                  <i className="fi fi-rr-bell"></i>
                  {
                    new_notification_available ? <span className='bg-red w-3 h-3 rounded-full absolute  z-10 top-2 right-2'></span> : ""
                  }

                </div>
                Notification
              </NavLink>

              {
                isAdmin ?
                  <NavLink to='/editor' onClick={(e) => setpageState(e.target.innerText)} className='sidebar-link'>
                    <i className="fi fi-rr-edit"></i>
                    Write
                  </NavLink> : ""
              }


              <h1 className='text-xl text-dark-grey mt-20 mb-3'>settings</h1>
              <hr className='border-grey/40 -ml-6 mb-8 mr-6' />


              <NavLink to='/settings/edit-profile' onClick={(e) => setpageState(e.target.innerText)} className='sidebar-link'>
                <i className="fi fi-rr-circle-user"></i>
                Edit Profile
              </NavLink>

              <NavLink to='/settings/change-password' onClick={(e) => setpageState(e.target.innerText)} className='sidebar-link'>
                <i className="fi fi-rr-lock"></i>
                Change Password
              </NavLink>
            </div>

          </div>



          <div className='mx-md:-mt-8 mt-5 w-full'>
            <Outlet />
          </div>
        </section>


      </>
      )
  )
}

export default SideNav