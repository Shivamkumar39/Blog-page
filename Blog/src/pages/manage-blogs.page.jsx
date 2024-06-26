import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../App'
import { Toaster } from 'react-hot-toast'
import InPageNavigation from '../components/inpage-navigation.component'
import Loader from '../components/loader.component'
import NodataMessage from '../components/nodata.component'
import AnimationWrapper from '../common/page-animation'
import ManagedPublishedBlog, { ManageDraftBlogPost } from '../components/manage-blogcard.component'
import { filterPageDataa } from '../common/filter-pagination-data'
import LoadMoreDataBtn from '../components/load-more.component'
import { useSearchParams } from 'react-router-dom'

const ManageBlog = () => {

  const [blogs, setBlogs] = useState(null)
  const [drafts, setDrafts] = useState(null)
  const [query, setQuery] = useState('')
  let activeTab = useSearchParams()[0].get('tab')

  let { userAuth: { access_token } } = useContext(UserContext)

  const getBlogs = ({ page, draft, deleteDocCount = 0 }) => {

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/user-written-blog', {
      page, draft, query, deleteDocCount
    }, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })
      .then(async ({ data }) => {
        let formatedData = await filterPageDataa({
          state: draft ? drafts : blogs,
          data: data.blogs,
          page,
          user: access_token,
          countRoute: '/user-written-blogs-count',
          data_to_send: { draft, query },



        })
        console.log(data);
        console.log(formatedData);

        if (draft) {
          setDrafts(formatedData)
        } else {
          setBlogs(formatedData)
        }
      }).catch(err => {

        console.log(err);
      })
  }

  useEffect(() => {

    if (access_token) {
      if (blogs == null) {
        getBlogs({ page: 1, draft: false })
      }
      if (drafts == null) {
        getBlogs({ page: 1, draft: true })
      }
    }

  }, [access_token, blogs, drafts, query])

  const handelsearch = (e) => {
    let searchQuery = e.target.value

    setQuery(searchQuery)

    if (e.keyCode == 13 && searchQuery.length) {
      setBlogs(null)
      setDrafts(null)
    }
  }
  const handleChanage = (e) => {
    if (!e.target.value.length) {
      setQuery('')
      setBlogs(null)
      setDrafts(null)

    }
  }
  return (
    <>
      <h1 className='max-md:hidden'>ManageBlogs</h1>

      <Toaster />

      <div className='relative max-md:mt-5 md:mt-8 mb-10'>
        <input onChange={handleChanage} onKeyDown={handelsearch} type='search' className='w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey' placeholder='Search Blogs' />
        <i className="fi fi-bs-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>

      </div>

      <InPageNavigation routes={['published Blogs', 'Drafts']} defaultActiveIndex={activeTab != 'draft' ? 0 : "1"}>
        { // published blog

          blogs == null ? (<Loader />) :
            (blogs.results.length) ?
              <>
                {
                  blogs.results.map((blog, i) => {
                    return <AnimationWrapper key={i} transition={{ delay: i * 0.4 }}>

                      <ManagedPublishedBlog blog={{...blog, index: i, setStateFunc: setBlogs}} />

                    </AnimationWrapper>
                  })
                }

                <LoadMoreDataBtn state={blogs} fetchDataFun={getBlogs} additionalParam={{draft: false, deleteDocCount: blogs.deleteDocCount}}  />
              </>
              : <NodataMessage message='no published blogs' />


        }


        { //draft blog

          drafts == null ? (<Loader />) :
            (drafts.results.length) ?
              <>
                {
                  drafts.results.map((blog, i) => {
                    return <AnimationWrapper key={i} transition={{ delay: i * 0.4 }}>

                      <ManageDraftBlogPost blog={{...blog, index: i, setStateFunc: setDrafts}} />

                    </AnimationWrapper>
                  })
                }
                <LoadMoreDataBtn state={drafts} fetchDataFun={getBlogs} additionalParam={{draft: true, deleteDocCount: drafts.deleteDocCount}}  />

              </>
              : <NodataMessage message='no published blogs' />


        }

      </InPageNavigation>
    </>
  )
}

export default ManageBlog