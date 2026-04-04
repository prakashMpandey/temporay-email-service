import { useState } from 'react'

function InputBox({ currentUrl, onGenerate, onCopy }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (currentUrl) {
      navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      onCopy?.()
    }
  }

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl mb-6 border border-gray-100">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Temporary Email
      </h1>
      <p className="text-center text-gray-400 mb-4 sm:mb-6 text-xs sm:text-sm">
        Your disposable email address - expires in 10 minutes
      </p>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-5">
        <input
          value={currentUrl || ''}
          readOnly
          placeholder="Click generate to get your email"
          className="flex-1 px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-100 rounded-2xl bg-gray-50 text-gray-800 text-sm font-medium outline-none focus:border-indigo-400 focus:bg-white transition-all placeholder:text-gray-400"
          type="text"
        />
        <button
          className="px-4 sm:px-5 py-3 sm:py-4 bg-emerald-500 text-white font-semibold rounded-2xl hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100 w-full sm:w-auto"
          onClick={handleCopy}
          disabled={!currentUrl}
        >
          {copied ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Done
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </span>
          )}
        </button>
      </div>

      <button
        className="w-full py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-indigo-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
        onClick={onGenerate}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Generate New Email
      </button>
    </div>
  )
}

export default InputBox
