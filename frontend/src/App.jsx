import { useState } from 'react'
import './App.css'
import InputBox from './components/InputBox.jsx'
import MailBox from './components/mailBox.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='w-full '>

      <div className="">

      <InputBox/>
      </div>
      <div className="">
        <MailBox/>
      </div>

      </div>

  )
}

export default App
