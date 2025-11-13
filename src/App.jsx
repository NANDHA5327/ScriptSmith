import { useState } from 'react'
import { generateCinematicPrompt } from './services/promptService'
import Editor from './components/Editor'
import Preview from './components/Preview'
import './App.css'

export default function App() {
  const [storyInput, setStoryInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!storyInput.trim()) {
      setError('Please enter a story idea')
      return
    }

    setError('')
    setLoading(true)
    try {
      const response = await generateCinematicPrompt(storyInput)
      setResult(response)
    } catch (err) {
      setError(err.message || 'Failed to generate prompt')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>ScriptSmith</h1>
        <p>Transform story ideas into cinematic prompts</p>
      </header>

      <div className="app-container">
        <div className="input-section">
          <div className="input-wrapper">
            <textarea
              value={storyInput}
              onChange={(e) => setStoryInput(e.target.value)}
              placeholder="Enter your one-line story idea..."
              className="story-input"
              rows="4"
              disabled={loading}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="generate-btn"
          >
            {loading ? 'Generating...' : 'Generate Prompt'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="output-section">
          {result ? (
            <>
              <Editor result={result} />
              <Preview result={result} />
            </>
          ) : (
            <div className="placeholder">
              <p>Enter a story idea and generate your cinematic prompt</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
