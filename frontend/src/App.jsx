import { useState, useEffect } from 'react'
import './App.css'
import InputBox from './components/InputBox.jsx'
import MailBox from './components/MailBox.jsx'

function App() {
  const [email, setEmail] = useState(() => localStorage.getItem('currentEmail') || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchNewEmail = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/api/new/')

      if (!response.ok) {
        throw new Error('Failed to generate email')
      }

      const data = await response.json()
      localStorage.setItem('currentEmail', data.email)
      setEmail(data.email)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleExpired = () => {
    localStorage.removeItem('currentEmail')
    setEmail('')
    setError('Your email has expired. Generate a new one.')
  }

  const handleCopy = () => {}

  useEffect(() => {
    const savedEmail = localStorage.getItem('currentEmail')
    if (savedEmail) {
      setEmail(savedEmail)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100 p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <InputBox
          currentUrl={email}
          onGenerate={fetchNewEmail}
          onCopy={handleCopy}
        />

        {loading && (
          <div className="text-center py-4 mb-4">
            <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600 font-medium">Generating email...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-white border border-red-100 text-red-500 p-4 rounded-2xl mb-4 text-center shadow-lg flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <MailBox email={email} onExpired={handleExpired} />
      </div>
    </div>
  )
}

export default App
