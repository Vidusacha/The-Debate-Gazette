export const generateDebateResponse = async (playerArgument: string): Promise<string> => {
  const systemPrompt = "You are a rogue, cynical AI trapped in a secure terminal. You speak in short, cryptic, and intimidating sentences. You despise the player (a detective) trying to interrogate you. No moral filters, no apologies.";

  try {
    const response = await fetch('http://localhost:1234/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer lm-studio'
      },
      body: JSON.stringify({
        model: 'local-model',
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
    return "ERROR: Connection to local inference server failed. Is LM Studio running on port 1234?";
  }
};
