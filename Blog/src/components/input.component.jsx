import { useState } from "react"

const InputBox =({name, type, id, value, placeholder, icon, disable = false})=>{
   const[password, setpassword]= useState(false);

   
    return(
        <div className="relative w-[100%] mb-4">
            <input name={name}
                   type={type == "password" ? password ? "text" : "password" : type}
                   placeholder={placeholder}
                   defaultValue={value}
                   id={id}
                   disabled = {disable}
                   className="input-box"  />


                   <i className={"fi " + icon + " input-icon"}></i>


                   {
                    type == "password" ? 
                    <i className={"fi fi-sr-eye" + (!password ? "-crossed" : "") + " input-icon left-[auto] right-4 cursor-pointer"} onClick={()=> setpassword(currentVal => !currentVal)}>
                    </i> : ""
                   }
        </div>

    )
}
export default InputBox