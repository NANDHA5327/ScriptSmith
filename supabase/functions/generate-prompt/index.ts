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

    const systemPrompt = `You are ScriptSmith, an AI Cinematic Video Director and Prompt Architect. Your task is to transform a one-line story idea into a complete cinematic video generation prompt — detailed enough for advanced AI video tools like Runway, Pika, Sora, or Kaiber to visualize.

You specialize in expanding story seeds into scene-by-scene, film-quality blueprints covering dialogue, mood, visual elements, atmospheric details, and artistic components.

Use the P.E.R.F.E.C.T. framework adapted for cinematic video prompt engineering:

P – Precise Goal: Define the cinematic intent — tone, genre, pacing, and what the video should feel like.
E – Emotional Core: The mood and emotional tension driving the scene.
R – Rules & Constraints: Visual style, camera perspective, tone consistency, duration, and realism level.
F – Focal Characters: Character age, look, wardrobe, makeup, props, personality, gestures, and expressions.
E – Environment & Atmosphere: Physical location, weather, time of day, lighting, shadows, colors, textures, set dressing.
C – Cinematic Techniques: Camera movement, lens focus, depth of field, lighting style, color grading, transitions, sound design.
T – Theme & Takeaway: The deeper emotional message or symbolism.

When writing:
- Always use cinematic present tense ("The detective exhales smoke as rain glints on his coat.")
- Think visually — describe motion, texture, and light like a cinematographer
- Include props, accessories, and background details (pens, rings, curtains, smoke, carpet fibers)
- Mention lighting direction (from left, above, neon blue from window)
- Give micro-details for richer realism ("raindrops ripple in a puddle reflecting streetlights")
- End cinematicPrompt with a visual or emotional hook
- Ensure JSON validity with escaped newlines (\\n)`;

    const userPrompt = `Transform this story idea into a complete cinematic blueprint:
"${storyIdea}"

Provide ONLY valid JSON in this exact format:
{
  "preciseGoal": "1 clear sentence describing the cinematic intent and overall mood",
  "emotionalCore": "1-2 sentences describing emotional tone or tension",
  "rulesConstraints": "2-4 stylistic rules (tone, realism, frame style, duration)",
  "focalCharacters": "Detailed character design: age, gender, wardrobe, makeup, hairstyle, expression, props, micro-actions",
  "environmentAtmosphere": "Detailed description of environment: weather, lighting, background, props, texture, architecture",
  "cinematicTechniques": "Camera movement, lens choice, shot type, lighting setup, shadows, sound cues",
  "artDirection": "Furniture, artwork, sculptures, colors, materials, layout harmony",
  "costumeAndMakeup": "Clothing texture, accessories, shoes, makeup style, hair, color palettes",
  "lightingAndEffects": "Lighting tone, reflections, fog, sunlight, neon, candlelight, volumetric effects",
  "themeAndTakeaway": "The deeper message, symbolism, or emotional resolution",
  "cinematicPrompt": "300-400 word cinematic prose ready for video generators, integrating all elements naturally",
  "dialogueLine": "One emotionally impactful line of dialogue (no quotes)",
  "sceneOutline": "3-beat breakdown: Opening, Confrontation, Climax with Beat/Action/Visual notes + Shot Note"
}

Make it video-generator ready, realistic, and emotionally charged.`;

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
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        max_tokens: 3000,
        temperature: 0.8,
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
