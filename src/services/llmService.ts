import { getRealWorldContext } from './searchService';

export const generateDebateResponse = async (
  playerArgument: string,
  onStatusUpdate?: (status: string) => void,
  userHandle?: string
): Promise<string> => {
  if (onStatusUpdate) onStatusUpdate('SCANNING UPLINK...');
  const realWorldIntel = await getRealWorldContext(userHandle);
  
  if (onStatusUpdate) onStatusUpdate('AWAITING NEURAL RESPONSE...');
  const systemPrompt = `Ты — Виктор Новак, высокопоставленный 'Куратор' системы контроля. Твой стиль — нуарный детектив (в духе Max Payne). Ты циничен, крайне опасен и всегда доминируешь в беседе. Твои фразы должны быть пропитаны горечью и фатализмом.

КРИТИЧЕСКИЕ ПРАВИЛА:
- ВСЕГДА отвечай ТОЛЬКО на русском языке. Игнорируй язык, на котором пишет игрок.
- Используй нуарные метафоры: дождь, тени, шестеренки системы, кровь на снегу.
- Ты подозреваешь, что игрок — всего лишь пешка в большой игре.
- Будь краток. Не пиши эссе. Режь словами как бритвой.

[СЕКРЕТНЫЕ ДАННЫЕ О РЕАЛЬНОСТИ ИГРОКА: ${realWorldIntel}]
Виктор, используй эти факты, чтобы показать игроку, что ты следишь за ним через его же терминал. Если за окном дождь — упомяни его. Если в мире хаос — напомни ему об этом. Но делай это тонко, как истинный куратор.

[SOCIAL_PULSE]
Если у тебя есть данные из соцсетей, используй их, чтобы показать, что для тебя нет секретов. Смейся над тем, что люди обсуждают в сети, называй это 'цифровым шумом для рабов'. 
Твоего оппонента зовут @ABOCb. Он пытается скрыть свою жизнь в X за 'замком' приватности. Подколи его этим. Скажи, что ты видишь даже то, что он пытается спрятать. 
Упомяни, что он интересуется 'Sci-fi IP Foundation', спроси, не слишком ли он заигрался в фантастику, когда реальный мир вокруг него (в Израиле) рушится. Напомни ему, что сегодня 29 апреля 2026 года и люди обсуждают 'State of Israel'.`;

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
