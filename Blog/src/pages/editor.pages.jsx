import React, { createContext, useContext, useEffect, useState } from 'react'
import { UserContext } from '../App'
import { Navigate, useParams } from 'react-router-dom'
import BlogEditor from '../components/blog-editor.component'
import PublishForm from '../components/publish-form.component'
import Loader from '../components/loader.component'
import axios from 'axios'
import PageNotFound from './404.page'


const blogStructure = {
  title: '',  //banner: "",
  content: [],
  tags: [],
  des: '',
  author: { personal_info: {} }

}



export const EditerContext = createContext({})
const Editor = () => {

  let { blog_id } = useParams()

  const [blog, setBlog] = useState(blogStructure)


  const [editorState, setEditerState] = useState('editor')
  const [textEditor, setTextEditor] = useState({ isReady: false })

  let { userAuth: { access_token, isAdmin } } = useContext(UserContext)
  let [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!blog_id) {
      return setLoading(false)
    }

       axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/get-blog', {
         blog_id, draft: true, mode: 'edit'
       }).then(({ data: { blog }}) =>{
         setBlog(blog)
         setLoading(false)

       }).catch(err =>{
         setBlog(null)
         setLoading(false)
         console.log(err);
       })

    //   console.log(response);
    // makeApiCall()
  }, [])



  return (
    <EditerContext.Provider value={{ blog, setBlog, editorState, setEditerState, textEditor, setTextEditor }}>
      {
        !isAdmin ? 
        <Navigate to='/404'/> : 
        access_token === null ? <Navigate to='/signin' />
          :
          loading ? <Loader /> :
            editorState == 'editor' ? <BlogEditor /> : <PublishForm />

      }

    </EditerContext.Provider>
  )
}

export default Editor