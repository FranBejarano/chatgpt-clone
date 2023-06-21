// Imports the useState and useEffect hooks from the React library, which allow managing state and performing side 
// effects within a functional component.
import { useState, useEffect } from "react"

// State declarations
const App = () => {
  const [value, setValue] = useState(null)
  const [message, setMessage] = useState(null)
  const [previousChats, setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }

  // Asynchronous function declaration for getMessages. It sends a POST request to http://localhost:8000/completions/ 
  // with a JSON payload containing the value as the message.The response is then parsed as JSON, and the message state 
  // is set to the first choice from the response
  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try {
      const response = await fetch('http://localhost:8000/completions/', options)
      const data = await response.json()
      setMessage(data.choices[0].message)
    } catch (error) {
      console.error(error)
    }
  }

  // hook that runs whenever the message or currentTitle state variables change. It checks if there is no currentTitle 
  // and both value and message are present.If true, it sets the currentTitle to the value.If all three variables 
  // are present, it updates the previousChats state by appending a new chat object to the array
  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if (currentTitle && value && message) {
      setPreviousChats(previousChats => (
        [...previousChats,
          {
            title: currentTitle,
            role: "user",
            content: value
          },
          {
            title: currentTitle,
            role: message.role,
            content: message.content
          }
        ]
      ))
    }
  }, [message, currentTitle])

  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}> {uniqueTitle}</li>)}
        </ul>
        <nav>
            <p>Made by Fran Bejarano</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>FranGPT</h1>}
          <ul className="feed">
            {currentChat?.map((chatMessage, index) => <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>)}
          </ul>
          <div className="bottom-section">
              <div className="input-container">
                  <input value={value} onChange={(e) => setValue(e.target.value)}/>
                  <div id="submit" onClick={getMessages}>➢</div>
              </div>
          </div>
        <p className="info">Free Research Preview. ChatGPT may produce inaccurate information about people, places, or
          facts. ChatGPT May 24 Version
        </p>
      </section>
    </div>
  )
}

export default App;
