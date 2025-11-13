const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { storyIdea, chatgptApiKey } = await req.json();

    if (!storyIdea) {
      return new Response(
        JSON.stringify({ error: "Story idea is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!chatgptApiKey) {
      return new Response(
        JSON.stringify({ error: "API key not provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const prompt = `You are ScriptSmith, an expert screenwriter and creative prompt engineer. Your task is to expand a one-line story idea into a fully structured cinematic creative brief.

Use the P.E.R.F.E.C.T. framework to expand this story:
"${storyIdea}"

Provide a response in the following exact JSON format (ensure all strings are properly escaped for JSON):
{
  "preciseGoal": "one clear sentence describing what this prompt should achieve",
  "emotionalCore": "1-2 sentences about the central emotion or tension",
  "rulesConstraints": "2-4 stylistic constraints or requirements",
  "focalCharacters": "character list with age, traits, motivation, and stakes (multiple lines)",
  "environmentAtmosphere": "1 paragraph of sensory and setting detail",
  "cinematicTechniques": "1 paragraph of filmic description (camera, lighting, sound, pacing)",
  "themeAndTakeaway": "1-2 sentences about underlying idea or moral tension",
  "cinematicPrompt": "200-350 word richly detailed description ready for generative models (present tense, visual storytelling)",
  "dialogueLine": "one emotionally revealing line of dialogue (without quotes)",
  "sceneOutline": "3-beat sequence with Opening/Confrontation/Climax sections, each with Beat/Action/Visual bullets and a final Shot note"
}

Ensure all content follows these rules:
- Write in cinematic present tense
- Prioritize visual storytelling and sensory immersion
- Keep descriptions precise, not flowery
- End the CINEMATIC_PROMPT with a hook or twist
- All strings must be properly JSON-escaped with line breaks represented as \\n`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${chatgptApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to generate prompt", details: error }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const result = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
