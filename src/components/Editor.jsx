import { useState } from 'react'
import './Editor.css'

export default function Editor({ result }) {
  const [copied, setCopied] = useState(false)

  const fullText = formatResultAsText(result)

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="editor-panel">
      <div className="editor-header">
        <h2>Code View</h2>
        <button onClick={handleCopy} className="copy-btn">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="editor-content">
        <code>{fullText}</code>
      </pre>
    </div>
  )
}

function formatResultAsText(result) {
  if (!result) return ''

  const lines = [
    `Precise Goal: ${result.preciseGoal}`,
    '',
    `Emotional Core: ${result.emotionalCore}`,
    '',
    `Rules & Constraints: ${result.rulesConstraints}`,
    '',
    `Focal Characters:`,
    result.focalCharacters,
    '',
    `Environment & Atmosphere: ${result.environmentAtmosphere}`,
    '',
    `Cinematic Techniques: ${result.cinematicTechniques}`,
    '',
    `Theme & Takeaway: ${result.themeAndTakeaway}`,
    '',
    '---',
    '',
    `CINEMATIC_PROMPT:`,
    '',
    result.cinematicPrompt,
    '',
    '---',
    '',
    `Sample line of dialogue:`,
    `"${result.dialogueLine}"`,
    '',
    '---',
    '',
    `SCENE_OUTLINE:`,
    '',
    result.sceneOutline,
  ]

  return lines.join('\n')
}
