import { useContext } from "react"
import { EditerContext } from "../pages/editor.pages"

const Tag =({tag, tagIndex})=>{


    let{blog, blog: {tags} , setBlog} = useContext(EditerContext)

    const handletagdelete = () =>{
        tags = tags.filter(t => t != tag)
        setBlog({...blog, tags})
    }
    const handletagEdit = (e)=>{
        if(e.keyCode == 13 || e.keyCode ==188)
            {
                e.preventDefault()
                let currentTag = e.target.innerText
                tags[tagIndex] = currentTag
                setBlog({...blog, tags})

                e.target.setAttribute("contentEditiable",false)

            }
    }

    const addEditTable = () =>{
        e.target.setAttribute("contentEditiable", true)
        e.target.focus()
    }
    return(
        <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-8">
            <p className="outline-none" onKeyDown={handletagEdit} onClick={addEditTable}>{tag}</p>
            <button onClick={handletagdelete} className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2">
            <i className="fi fi-br-cross-small text-xl pointer-events-none"></i>
            </button>
        </div>
    )
}
export default Tag