const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const CHATGPT_API_KEY = import.meta.env.VITE_CHATGPT_API_KEY

export async function generateCinematicPrompt(storyIdea) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !CHATGPT_API_KEY) {
    throw new Error('Missing configuration')
  }

  const functionUrl = `${SUPABASE_URL}/functions/v1/generate-prompt`

  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ storyIdea, chatgptApiKey: CHATGPT_API_KEY }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Prompt generation error:', error)
    throw new Error('Failed to generate cinematic prompt')
  }
}
