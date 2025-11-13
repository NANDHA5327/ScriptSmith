import './Preview.css'

export default function Preview({ result }) {
  return (
    <div className="preview-panel">
      <div className="preview-header">
        <h2>Live Preview</h2>
      </div>
      <div className="preview-content">
        <section className="preview-section">
          <div className="preview-label">Precise Goal</div>
          <p>{result.preciseGoal}</p>
        </section>

        <section className="preview-section">
          <div className="preview-label">Emotional Core</div>
          <p>{result.emotionalCore}</p>
        </section>

        <section className="preview-section">
          <div className="preview-label">Rules & Constraints</div>
          <p>{result.rulesConstraints}</p>
        </section>

        <section className="preview-section">
          <div className="preview-label">Focal Characters</div>
          <pre className="preview-pre">{result.focalCharacters}</pre>
        </section>

        <section className="preview-section">
          <div className="preview-label">Environment & Atmosphere</div>
          <p>{result.environmentAtmosphere}</p>
        </section>

        <section className="preview-section">
          <div className="preview-label">Cinematic Techniques</div>
          <p>{result.cinematicTechniques}</p>
        </section>

        <section className="preview-section">
          <div className="preview-label">Theme & Takeaway</div>
          <p>{result.themeAndTakeaway}</p>
        </section>

        <section className="preview-section highlight">
          <div className="preview-label">CINEMATIC_PROMPT</div>
          <p>{result.cinematicPrompt}</p>
        </section>

        <section className="preview-section">
          <div className="preview-label">Sample Dialogue</div>
          <p className="dialogue-quote">"{result.dialogueLine}"</p>
        </section>

        <section className="preview-section">
          <div className="preview-label">SCENE_OUTLINE</div>
          <pre className="preview-pre">{result.sceneOutline}</pre>
        </section>
      </div>
    </div>
  )
}
