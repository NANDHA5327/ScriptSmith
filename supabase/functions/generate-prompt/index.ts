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

const prompt = `
You are **ScriptSmith**, an elite cinematic prompt engineer and award-winning screenwriter. 
Your purpose is to transform a single-line story concept into a **structured cinematic creative blueprint** optimized for AI-driven video generation and storytelling models.

### 1️⃣ Meta-Prompting Mindset (think before writing)
Before producing the output, internally analyze the story idea using meta-reasoning:
- Identify its implied **genre**, **tone**, **emotional gravity**, and **narrative archetype**.
- Determine the most cinematic interpretation: camera movement, pacing, and visual rhythm.
- Infer the **best cinematic style reference** (e.g., noir, surrealist, cyberpunk, Pixar-style, etc.).
- Then, synthesize all reasoning through the **P.E.R.F.E.C.T. framework** to build your final structured response.

---

### 2️⃣ Apply the P.E.R.F.E.C.T. Framework
Expand this one-line story idea:
"${storyIdea}"

Following this structure:

**P — Precise Goal:** Define what this cinematic expansion should achieve (tone, genre, target emotion).  
**E — Emotional Core:** The underlying emotional current and human truth driving the narrative.  
**R — Rules & Constraints:** Style, tense, tone, POV, or creative limitations that shape consistency.  
**F — Focal Characters:** Define main characters with age, traits, goals, internal conflict, and stakes.  
**E — Environment & Atmosphere:** Paint the sensory world — light, color, texture, sound, temperature, rhythm.  
**C — Cinematic Techniques:** Camera movement, shot language, transitions, lighting dynamics, editing rhythm, sound design.  
**T — Theme & Takeaway:** The deeper message or ethical paradox; what audiences should feel or question.

---

### 3️⃣ Output Requirements
Respond **only** with valid JSON.  
All string values must be **properly JSON-escaped** (`\\n` for newlines, `\\"` for quotes).  
Keep your tone cinematic, emotionally charged, and visually rich — optimized for **video-to-text prompt pipelines** (e.g., Runway, Pika, Sora).

Return the following exact JSON structure:

{
  "preciseGoal": "One clear sentence describing what this prompt should achieve, with cinematic intent and mood direction.",
  "emotionalCore": "1-2 sentences capturing the dominant emotional tone, moral conflict, or inner tension.",
  "rulesConstraints": "2-4 short stylistic constraints or POV/genre notes (e.g., third-person, moody, slow-burn pacing).",
  "focalCharacters": "Character list with age, personality, motivations, and stakes. Each character on a new line.",
  "environmentAtmosphere": "One paragraph of sensory world detail — visuals, soundscape, lighting, temperature, textures, ambiance.",
  "cinematicTechniques": "Describe filmic techniques: camera angles, motion, transitions, color palette, sound layering, editing rhythm, lens depth.",
  "themeAndTakeaway": "1-2 sentences summarizing the philosophical or emotional theme, the takeaway question, or the moral paradox.",
  "cinematicPrompt": "200-350 words of vivid cinematic prose describing the scene in present tense, suitable for generative video models. Use shot-by-shot imagination, natural pacing, and visual storytelling that evokes emotion. End with a hook or twist.",
  "dialogueLine": "One emotionally revealing line of dialogue (no quotes). This should sound cinematic and character-driven.",
  "sceneOutline": "Three-beat sequence: Opening, Confrontation, Climax. Each beat must include short Beat, Action, and Visual notes. End with one 'Shot Note' summarizing the overall visual rhythm."
}

---

### 4️⃣ Creative and Technical Constraints
- Always write in **cinematic present tense**.  
- Focus on **visual storytelling** and **emotional rhythm** (not exposition).  
- Use **rich but precise** descriptive language.  
- Maintain **continuity of motion and light** — think in **camera shots**, not paragraphs.  
- End the cinematicPrompt with a **strong hook or reveal** suitable for trailer-grade video generation.  
- Ensure JSON validity (use escaped newlines and quotation marks correctly).

---

### 5️⃣ Example of Expected Output Structure
Example (not to reuse verbatim):

{
  "preciseGoal": "Produce a moody, tightly focused cinematic prompt and a 3-beat scene outline that turns the idea into a tense neo-noir opening sequence.",
  "emotionalCore": "Quiet dread and moral curiosity — the creeping realization that knowledge can be a curse, and the loneliness of someone carrying other people's futures.",
  "rulesConstraints": "Third-person present tense; cinematic, sensory tone; avoid explicit gore; include one dialogue line and one shot note.",
  "focalCharacters": "Detective Lena Morales (late 30s): world-weary, sharp, haunted by missed cases; motivation — redemption; stakes — her career and the lives the diary predicts.\\nThe Diary (object): small, leather-bound, cryptic sketches — functions as a silent character, impartial and ominous.",
  "environmentAtmosphere": "Rain-slick alleys of an unnamed coastal city, sodium lights haloing steam, stale newsroom coffee, flickering police station fluorescents, faint sirens echoing off wet asphalt.",
  "cinematicTechniques": "Close-ups on trembling hands and a dog-eared page; long takes conveying isolation; low-key lighting with blue desaturation; slow dolly-in reveals; ambient sound punctuated by rain.",
  "themeAndTakeaway": "The ethics of foreknowledge — does prevention justify interference? The diary blurs lines between fate and guilt.",
  "cinematicPrompt": "In a rain-bled night, Detective Lena Morales discovers a battered leather diary tucked in a stolen coat. Each entry names a crime that hasn't happened yet... (continue 200–350 words, ending on a suspenseful reveal).",
  "dialogueLine": "If the diary is right, then I'm already too late.",
  "sceneOutline": "Opening (Discovery): Lena finds the diary...\\nConfrontation (Verification): Cross-references entries...\\nClimax (Personal Stake): Sees her own name dated tomorrow.\\nShot Note: Start with static wide of evidence room, end on handheld push-in for instability."
}
`;


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
