import React from 'react'
import {useState,useEffect} from 'react'

export default function MailBox() {

    const [mails,setMails]=useState([]);

    const fetchMessages=async()=>{

        const formData=new FormData;

        formData.append('email',localStorage.getItem('currentEmail'))

        const response=await fetch('http://localhost:8000/api/messages/',{method:'post',
            body:formData  });

        const data=await response.json();




        console.log(data);

        setMails(data.data);
    }

    useEffect(()=>{
        fetchMessages()
    },[])

  return (
    <div>

     <p>mails page</p>
     <div className="">
        <button onClick={fetchMessages} className='bg-orange-500 text-white text-xl capitalize text-center'>refresh</button>
     </div>
     <div className="">
        {
            mails.length > 0 && mails.map((mail,index)=>{
                return(
                    <div key={index} className='bg-gray-700 text-white p-2 my-2 rounded-10'>
                        <p className='text-lg font-bold'>{mail.subject}</p>
                        <p>{mail.sender}</p>
                    </div>
                )
            })
        }

     </div>
    </div>
  )
}


