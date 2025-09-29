import { useState } from 'react'
import axios from 'axios'
import './App.css'

// Get backend URL from environment variable or use default
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

console.log('Backend URL:', BACKEND_URL)

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [randomString, setRandomString] = useState('')
  const [databases, setDatabases] = useState([])
  const [error, setError] = useState('')

  const triggerTask = async () => {
    setIsLoading(true)
    setError('')
    setRandomString('')
    setDatabases([])

    try {
      // Trigger ECS Fargate task and get random string + database list
      const response = await axios.post(`${BACKEND_URL}/api/trigger-task`)
      
      if (response.data.success) {
        setRandomString(response.data.randomString)
        // Set databases from the trigger-task response
        setDatabases(response.data.databases || [])
      } else {
        setError('Failed to trigger task')
      }
    } catch (err) {
      console.error('Error triggering task:', err)
      setError(err.response?.data?.message || 'Failed to connect to backend')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>MediaMint</h1>
        <p>Cloud Task Management System</p>
      </header>

      <main className="main-content">
        <div className="task-section">
          <button 
            className="trigger-button" 
            onClick={triggerTask}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Trigger Task'}
          </button>

          {error && (
            <div className="error-message">
              <p>Error: {error}</p>
            </div>
          )}

          {randomString && (
            <div className="result-section">
              <h2>Generated Random String</h2>
              <div className="random-string">
                <code>{randomString}</code>
              </div>
            </div>
          )}

          {databases.length > 0 && (
            <div className="databases-section">
              <h2>Available Databases</h2>
              <ul className="database-list">
                {databases.map((db, index) => (
                  <li key={index} className="database-item">
                    <strong>{db.name}</strong>
                    {db.size && <span className="db-size"> ({db.size})</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
