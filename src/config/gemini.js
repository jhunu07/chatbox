async function runChat(prompt, history = []) {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const contents = [
    ...history.flatMap(item => [
      { role: "user", parts: [{ text: item.prompt }] },
      { role: "model", parts: [{ text: item.response }] }
    ]),
    { role: "user", parts: [{ text: prompt }] }
  ];

  const data = {
    contents: contents,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    const responseData = await response.json();
    return responseData.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error running chat:", error);
    return `Error: Unable to get response from Gemini API. ${error.message}`;
  }
}

export default runChat;
