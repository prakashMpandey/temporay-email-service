import { useState, useEffect, useCallback } from 'react'
import EmailDetail from './EmailDetail'
import config from '../config'

const POLL_INTERVAL = 5000

// Helper function to strip HTML and decode entities for preview
const getTextPreview = (html, maxLength = 100) => {
  if (!html) return 'No preview available'

  // Create a temporary DOM element to parse HTML
  const temp = document.createElement('div')
  temp.innerHTML = html

  // Get text content (automatically handles entities and nested tags)
  const text = temp.textContent || temp.innerText || ''

  // Trim and limit length
  return text.trim().slice(0, maxLength) || 'No preview available'
}

export default function MailBox({ email, onExpired }) {
  const [mails, setMails] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedMail, setSelectedMail] = useState(null)

  const fetchMessages = useCallback(async () => {
    if (!email) return

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('email', email)

      const response = await fetch(`${config.apiUrl}/api/messages/`, {
        method: 'POST',
        body: formData,
      })

      if (response.status === 410) {
        setError('Email has expired')
        onExpired?.()
        return
      }

      if (response.status === 404) {
        setError('Email session not found')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }

      const data = await response.json()
      setMails(data.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [email, onExpired])

  useEffect(() => {
    if (!email) return

    fetchMessages()

    const intervalId = setInterval(fetchMessages, POLL_INTERVAL)

    return () => clearInterval(intervalId)
  }, [email, fetchMessages])

  if (!email) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl text-center border border-gray-100">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <p className="text-gray-400 text-base sm:text-lg">Generate an email to start receiving messages</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-100 gap-3 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">Inbox</h2>
              <p className="text-xs text-gray-400">{mails.length} message{mails.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={fetchMessages}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-indigo-600 border border-gray-200 rounded-xl font-medium hover:bg-indigo-50 hover:border-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto justify-center"
            disabled={loading}
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="mx-4 sm:mx-6 mt-4 bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="p-4 sm:p-6 max-h-[450px] overflow-y-auto">
          {mails.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gray-50 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-400 mb-1 text-sm sm:text-base">No emails yet</p>
              <p className="text-gray-300 text-xs sm:text-sm">Waiting for incoming messages...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 sm:gap-3">
              {mails.map((mail, index) => (
                <div
                  key={mail.id || index}
                  className="rounded-xl sm:rounded-2xl p-3 sm:p-5 cursor-pointer transition-all border-2 border-transparent bg-gray-50 hover:bg-gray-100 hover:border-indigo-200 group"
                  onClick={() => setSelectedMail(mail.id)}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
                        {mail.sender?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">{mail.sender}</p>
                        <p className="text-xs text-gray-400 truncate">
                          {new Date(mail.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedMail && (
        <EmailDetail
          emailId={selectedMail}
          onClose={() => setSelectedMail(null)}
        />
      )}
    </>
  )
}
