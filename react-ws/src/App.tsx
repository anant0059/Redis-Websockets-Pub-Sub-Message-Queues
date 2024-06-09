import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function useSocket() {
  const [socket, setSocket] = useState<any>(null)
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080')
    socket.onopen = () => {
      console.log('Connected')
      setSocket(socket)
    }

    return () => {
      socket.close()
    }
  }, [])

  return socket;
}

function App() {
  const socket = useSocket();
  const [messages, setMessages] = useState<string[]>([])
  const [latestMessage, setLatestMessage] = useState("");
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event: MessageEvent) => {
        const message = event.data as string;
        console.log(`Received message: ${message}`)
        setMessages((prevMessages) => [...prevMessages, message])
        setLatestMessage(message)
      }
    }
  }, [socket])

  if (!socket) {
    return <div>
      Connecting to socket server...
    </div>
  }

  return (
    <>
      <input onChange={(e) => {
        setMessage(e.target.value)
      }}></input>
      <button onClick={() => {
        socket.send(message);
      }}>Send</button>
      {latestMessage}
    </>
  )
}

export default App
