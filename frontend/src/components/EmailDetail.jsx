import { useState,useEffect } from 'react'

export default function EmailDetail({ emailId, onClose }) {


  
  const [email,setEmailData]=useState();

  const fetchEmailData=async()=>{

    const response=await fetch(`http://localhost:8000/api/messages/${emailId}`);

    const data=await response.json();

    setEmailData(data)


  }

  useEffect(() => {
    const handleEscape = (e) => {

      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  useEffect(()=>{
    fetchEmailData()
  },[])

  if (!email) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {email.sender?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{email.sender}</p>
              <p className="text-sm text-gray-400">
                {new Date(email.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Subject */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">{email.subject || '(No Subject)'}</h2>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div
            className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: email.body || '<p class="text-gray-400 italic">No content</p>' }}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
