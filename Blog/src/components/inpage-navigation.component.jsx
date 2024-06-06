import React, { useEffect, useRef, useState } from 'react'

export let activeLineRef;
export let activeTabRef;
const InPageNavigation = ({routes, defaultHidden=[ ], defaultActiveIndex  = 0, children}) => {
     activeLineRef = useRef()
     activeTabRef = useRef()
    let [inpageNavIndex, setinpagenavindex] = useState(defaultActiveIndex)


    const chanagePageState = (btn, i) =>{

        let { offsetWidth, offsetLeft } = btn;

        activeLineRef.current.style.width = offsetWidth + 'px';
        activeLineRef.current.style.left = offsetLeft + 'px';


        setinpagenavindex(i)

    }

    useEffect(()=>{
        chanagePageState(activeTabRef.current, defaultActiveIndex)
    }, [])


  return (
    <>

       <div className='relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto'>

           {
            routes.map((route, i) =>{
                return(
                    <button ref={i == defaultActiveIndex ? activeTabRef : null} key={i} className={'p-4 px-5 capitalize ' + (inpageNavIndex == i ? "text-black" : "text-dark-grey " ) + ( defaultHidden.includes(route) ? " md:hidden " : " " )} onClick={(e)=>{
                        {chanagePageState(e.target, i)}
                    }}>{route}</button>
                )
            })
           }

           <hr ref={activeLineRef} className='absolute bottom-0 duration-300'></hr>
       </div>

       { Array.isArray(children) ? children[inpageNavIndex] : children }

    </>
  )
}

export default InPageNavigation