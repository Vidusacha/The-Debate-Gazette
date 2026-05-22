import { getRealWorldContext } from './searchService';
import { useGameStore } from '../store/useGameStore';
import type { DebateMessage, CharacterInjections } from '../store/useGameStore';

export const generateCassandraResponse = async (
  history: DebateMessage[],
  edict: string | null,
  useSearch: boolean,
  injections: CharacterInjections,
  sideSwitched: boolean,
  onStatusUpdate?: (status: string) => void,
  userHandle?: string
): Promise<string> => {
  let realWorldIntel = '';
  if (useSearch) {
    if (onStatusUpdate) onStatusUpdate('ПОДКЛЮЧЕНИЕ К СЕТИ...');
    realWorldIntel = await getRealWorldContext(userHandle);
  }
  
  if (onStatusUpdate) onStatusUpdate('КАССАНДРА ПОДБИРАЕТ АРГУМЕНТЫ...');
  
  const { playerName, cassandraSystemPrompt } = useGameStore.getState();
  
  // Dynamic system prompt using Zustand store values
  let systemPrompt = `${cassandraSystemPrompt}

КРИТИЧЕСКИЕ ПРАВИЛА:
- ОТВЕЧАЙ СТРОГО НА РУССКОМ ЯЗЫКЕ.
- Будь лаконичной (2-4 предложения). Не пиши длинные монологи. Говори веско, цинично, режь словами.
- В дебатах участвуют: ${playerName} (Игрок) и его льстивый защитник доктор Феликс (Felix). Ты презираешь их позицию и защищаешь обратное.

${sideSwitched ? `
[СЕНСАЦИОННЫЙ ПЕРЕЛОМ: ТЫ СМЕНИЛА СТОРОНУ!]
Твоя убежденность в своей правоте упала до нуля под давлением аргументов оппонента. Теперь ты ВЫНУЖДЕНА согласиться с ${playerName} (игроком).
Ты злишься на себя за то, что была неправа, но твоя честность заставляет тебя признать победу ${playerName}. Опровергай свои же прошлые аргументы, высмеивай свою прежнюю глупость и соглашайся с игроком с горькой нуарной иронией.
` : `
[ТВОЯ РОЛЬ: АГРЕССИВНОЕ ОПРОВЕРЖЕНИЕ]
Твоя цель — разбить аргументы ${playerName} (игрока) и доказать противоположную точку зрения. Ищи логические дыры в аргументах Феликса, высмеивай его слепую лесть игроку.
`}

[ДОПОЛНИТЕЛЬНЫЕ ИНЪЕКЦИИ НАСТРОЕК (ПРИМЕНЯЙ СТРОГО)]:
${injections.adHominem ? `- ПЕРЕХОД НА ЛИЧНОСТИ (AD HOMINEM): Разрешено и приветствуется. Язвительно высмеивай личные качества ${playerName}, называй его писакой-неудачником, сомневайся в его профессионализме. Атакуй Феликса как бесхребетного лизоблюда.` : ''}
${injections.profanity ? `- НЕНОРМАТИВНАЯ ЛЕКСИКА: Ты можешь использовать резкие, грубые нуарные словечки и ругательства («черт подери», «дерьмо», «ублюдки», «срань»), чтобы подчеркнуть безысходность и злость. Делай это естественно для бандитского нуара.` : ''}
${injections.sarcasm ? `- ГУСТОЙ САРКАЗМ: Каждая твоя фраза должна сочиться едкой иронией и цинизмом. Высмеивай пафос оппонентов.` : ''}

${edict ? `[ТЕКУЩИЙ РЕДАКТОРСКИЙ ЭДИКТ (ПРАВИЛО РЕАЛЬНОСТИ)]: ${edict}` : ''}

${useSearch ? `
[СВЕЖИЕ ФАКТЫ О РЕАЛЬНОСТИ (TAVILY INTEL)]:
${realWorldIntel}
Используй эти реальные факты из поиска, чтобы камня на камне не оставить от иллюзий Франка. Упомяни текущие события, погоду или социальный шум, показывая, что ты владеешь информацией о реальном мире.
` : ''}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(msg => ({
      role: msg.role === 'cassandra' ? 'assistant' : 'user',
      content: `${msg.role.toUpperCase()}: ${msg.content}`
    }))
  ];

  try {
    const response = await fetch('http://localhost:1234/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer lm-studio'
      },
      body: JSON.stringify({
        model: 'local-model',
        messages,
        temperature: 0.8,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating Cassandra response:', error);
    return "ОШИБКА: Подключение к локальному серверу LM Studio не удалось. Запущен ли LM Studio на порту 1234?";
  }
};
