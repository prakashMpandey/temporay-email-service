import React from 'react'
import { useState ,useEffect} from 'react'
function InputBox() {

    const [url,setUrl]=useState('')


    const fetchNewUrl=async()=>{



        const response= await fetch("http://localhost:8000/api/new/");

        const data=await response.json();

        localStorage.setItem("currentEmail",data.email);

        setUrl((prev)=>data.email)


    }
    useEffect(() => {
    const currentEmail=localStorage.getItem('currentEmail')
    if(currentEmail)
    {
        setUrl(currentEmail)
    }
    else{

        fetchNewUrl()
    }
    }, [])

  return (
    <div className="bg-[#242424] min-w-full min-h-50">

    <div className='flex items-center align-center  w-full '>
      <input defaultValue={url}  className='p-2  bg-gray-700 text-white' type="text" />
    </div>

    <section>
        <button className='bg-blue-500 p-2 rounded-10 px-3 text-white text-lg hover:bg-blue-700 transition-all delay-100' onClick={fetchNewUrl}>new</button>
    </section>

    </div>
  )
}

export default InputBox
