const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function runChat(prompt, history = [], signal = null) {
  try {
    // Convert history to Groq format
    const messages = history.flatMap(item => [
      {
        role: "user",
        content: item.prompt,
      },
      {
        role: "assistant",
        content: item.response,
      }
    ]);

    // Add current prompt
    messages.push({
      role: "user",
      content: prompt,
    });

    // Call Groq API
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 1,
      }),
      signal: signal // Add abort signal support
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a moment.");
      } else if (response.status === 401) {
        throw new Error("Invalid API key. Please check your Groq API key.");
      } else {
        throw new Error(errorData.error?.message || "Failed to get response from Groq");
      }
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "No response generated.";
  } catch (error) {
    console.error("Error running chat:", error);
    throw error;
  }
}

export default runChat;
