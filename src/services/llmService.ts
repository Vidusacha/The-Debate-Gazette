export const generateDebateResponse = async (playerArgument: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const model = import.meta.env.VITE_OPENAI_MODEL_NAME || 'gpt-4o';

  if (!apiKey) {
    console.error('Missing OpenAI API key');
    return "ERROR: Neural link disconnected. Missing API Key.";
  }

  const systemPrompt = "You are a cold, cynical AI defending a massive corporate conspiracy. Respond in 2-3 short, intimidating sentences. Be dismissive of the player's arguments.";

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: playerArgument }
        ],
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating debate response:', error);
    return "ERROR: Connection to mainframe timed out.";
  }
};
