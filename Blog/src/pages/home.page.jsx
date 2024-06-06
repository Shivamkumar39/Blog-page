import React, { useEffect, useState } from 'react'
import AnimationWrapper from '../common/page-animation'
import InPageNavigation from '../components/inpage-navigation.component'
import axios from 'axios'
import Loader from '../components/loader.component'
import BlogPostCard from '../components/blog-post.component'
import MinimalBlogPost from '../components/nobanner-blog-post.component'
import { activeTabRef } from '../components/inpage-navigation.component'
import NodataMessage from '../components/nodata.component'
import filterPageDataa from '../common/filter-pagination-data'
import LoadMoreDataBtn from '../components/load-more.component'

const Homepage = () => {

    let [blogs, setBlog] = useState(null)
    let [trendingBlogs, setTrendingBlogs] = useState(null)
    let [pageState, setPageState] = useState("home")
    let categories = ['programming', "coding", 'React', 'Films', 'Tech', 'cooking', 'social media', 'travel']


    const fetchLatestBlogs = ({ page = 1 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/latest-blogs', { page })
            .then(async ({ data }) => {
                let formateData = await filterPageDataa({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: '/all-latest-blogs-count',
                    
                })
                setBlog(formateData)
               // console.log(formateData);
            }).catch(err => {
                console.log(err)
            })
    }

    const fetchBlogByCategory = ({ page = 1 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/search-blogs', { tag: pageState, page })
            .then( async ({ data }) => {
                let formateData = await filterPageDataa({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: '/search-blogs-count',
                    data_to_send: { tag: pageState }
                })
                setBlog(formateData)
            }).catch(err => {
                console.log(err)
            })
    }

    const fetchTrendingBlog = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + '/trending-blogs')
            .then(({ data }) => {
                setTrendingBlogs(data.blogs)
            }).catch(err => {
                console.log(err)
            })
    }




    const loadBlogByCategory = (e) => {
        let category = e.target.innerText.toLowerCase()

        setBlog(null)

        if (pageState == category) {
            setPageState("home")
            return
        }
        setPageState(category)
    }


    useEffect(() => {
        activeTabRef.current.click()

        if (pageState == "home") {
            fetchLatestBlogs({ page: 1 })
        } else {
            fetchBlogByCategory({ page: 1 })
        }
        if (!trendingBlogs) {
            fetchTrendingBlog()
        }

    }, [pageState])


    return (
        <AnimationWrapper>
            <section className='h-cover flex justify-center gap-10'>
                {/* lates blog */}
                <div className='w-full'>

                    <InPageNavigation routes={[pageState, "trending blogs"]} defaultHidden={["trending blogs"]}>

                        <>
                      
                            {
                                
                                blogs == null ? (<Loader />) :
                                    (
                                        blogs.results.length ?

                                            blogs.results.map((blog, i) => {
                                                return (
                                                    <AnimationWrapper transition={{ duration: 1, delay: i * 0.1 }} key={i}>

                                                        <BlogPostCard content={blog} author={blog.author.personal_info} />
                                                    </AnimationWrapper>
                                                );
                                            })

                                            : <NodataMessage message='NO Blog Publish' />
                                    )}

                                    <LoadMoreDataBtn state={blogs} fetchDataFun={(pageState == 'home' ? fetchLatestBlogs : fetchBlogByCategory)} />
                        </>

                        {
                            trendingBlogs == null ? (<Loader />) :
                                (
                                    trendingBlogs.length ?
                                    trendingBlogs.map((blog, i) => {
                                        return (<AnimationWrapper transition={{ duration: 1, delay: i * 0.1 }} key={i}>

                                            <MinimalBlogPost blog={blog} index={i} />
                                        </AnimationWrapper>
                                        )
                                    })
                                    : <NodataMessage message='NO Blog Publish' />

                                )}


                    </InPageNavigation>

                </div>

                {/* Home page blog */}
                <div className='min-w-[40%] lg:min-w-[400px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden'>

                    <div className='flex flex-col gap-10'>

                        <div >
                            <h1 className='font-medium text-xl mb-8'>Stories form all interests</h1>

                            <div className='flex gap-3 flex-wrap'>
                                {
                                    categories.map((category, i) => {
                                        return <button onClick={loadBlogByCategory} className={'tag ' + (pageState == category ? "bg-black text-white" : " ")} key={i}>
                                            {category}
                                        </button>
                                    })
                                }
                            </div>

                        </div>


                        <div>
                            <h1 className='font-medium text-xl mb-8'>Trending Blogs <i className="fi fi-rr-arrow-trend-up"></i></h1>

                            {

                                trendingBlogs == null ? (<Loader />) :
                                    (
                                        trendingBlogs.length ?
                                            trendingBlogs.map((blog, i) => {
                                                return (<AnimationWrapper transition={{ duration: 1, delay: i * 0.1 }} key={i}>

                                                    <MinimalBlogPost blog={blog} index={i} />
                                                </AnimationWrapper>
                                                )
                                            })
                                            : <NodataMessage message='No trending Blog' />
                                    )}

                        </div>

                    </div>
                </div>
            </section>
        </AnimationWrapper>
    )
}

export default Homepage