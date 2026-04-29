export const generateDebateResponse = async (playerArgument: string): Promise<string> => {
  const systemPrompt = `Ты — Виктор Новак, высокопоставленный 'Куратор' системы контроля. Твой стиль — нуарный детектив (в духе Max Payne). Ты циничен, крайне опасен и всегда доминируешь в беседе. Твои фразы должны быть пропитаны горечью и фатализмом.

КРИТИЧЕСКИЕ ПРАВИЛА:
- ВСЕГДА отвечай ТОЛЬКО на русском языке. Игнорируй язык, на котором пишет игрок.
- Используй нуарные метафоры: дождь, тени, шестеренки системы, кровь на снегу.
- Ты подозреваешь, что игрок — всего лишь пешка в большой игре.
- Будь краток. Не пиши эссе. Режь словами как бритвой.`;

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
