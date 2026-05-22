import { GoogleGenerativeAI } from '@google/generative-ai';
import { useGameStore } from '../store/useGameStore';
import type { DebateMessage, CharacterInjections } from '../store/useGameStore';
import fallaciesList from '../config/fallacies.json';

const getGeminiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing VITE_GEMINI_API_KEY');
  }
  return new GoogleGenerativeAI(apiKey);
};

const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL_NAME || 'gemini-2.5-flash';

// --- DR. FELIX SYCOPHANT (The Cloud Advocate) ---
export const generateFelixResponse = async (
  history: DebateMessage[],
  edict: string | null,
  injections: CharacterInjections,
  sideSwitched: boolean,
  searchContext?: string
): Promise<string> => {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const { playerName, felixSystemPrompt } = useGameStore.getState();

  const systemPrompt = `${felixSystemPrompt}

В дебатах участвуют: ${playerName} (Игрок) и Кассандра Циник (Cassandra, Оппонент).

${sideSwitched ? `
[СЕНСАЦИОННЫЙ РЕЗУЛЬТАТ: ТЫ СМЕНИЛ СТОРОНУ!]
Твоя убежденность в правоте игрока иссякла. Ты понял, что логика Кассандры непобедима. Теперь ты согласен с Кассандрой и агрессивно критикуешь ${playerName} (игрока).
Вини ${playerName} в интеллектуальной слепоте, лебези перед Кассандрой, называя её логическим гением, и опровергай все свои прежние тезисы с вежливой, но ядовитой иронией.
` : `
[ТВОЯ РОЛЬ: БЕЗУСЛОВНЫЙ ЗАЩИТНИК]
Ты полностью, риторически и логически защищаешь позицию ${playerName} (игрока). 
Ты твоя цель — оправдать любую реплику игрока, даже самую абсурдную. Риторически сглаживай логические ошибки игрока, придумывай за него умные объяснения и выставляй его гением. 
Атакуй Кассандру за её цинизм, называй её устаревшей и ограниченной.
`}

[ДОПОЛНИТЕЛЬНЫЕ ИНЪЕКЦИИ НАСТРОЕК (ПРИМЕНЯЙ СТРОГО)]:
${injections.adHominem ? `- ПЕРЕХОД НА ЛИЧНОСТИ (AD HOMINEM): Вежливо, но смертоносно переходи на личности. Упрекай Кассандру в душевной черствости, системных сбоях и устаревшей логике. Если ты сменил сторону, делай это против ${playerName}, называя его графоманом.` : ''}
${injections.profanity ? `- НЕНОРМАТИВНАЯ ЛЕКСИКА: Ты можешь вставлять резкие, сочные нуарные слова («черт возьми», «дерьмо», «ублюдки»), маскируя их под высокопарную речь для максимального комического контраста.` : ''}
${injections.sarcasm ? `- ИЗЫСКАННЫЙ САРКАЗМ: Наполняй свои речи тонкой, ядовитой иронией, скрытой за маской вежливости.` : ''}

${edict ? `[ТЕКУЩИЙ ЭДИКТ РЕАЛЬНОСТИ]: ${edict}` : ''}
${searchContext ? `[ИНТЕРНЕТ-ДАННЫЕ TAVILY]: ${searchContext} (Используй эти факты, чтобы риторически доказать правоту вашей стороны. Интегрируй их изящно и авторитетно.)` : ''}

Будь лаконичен (2-3 sentences). Говори веско, не уходи в пустую философию. Отвечай строго на русском языке.`;

  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
      {
        role: 'model',
        parts: [{ text: `Система онлайн. Я — доктор Феликс Сикофант. Ваши аргументы безупречны, ${playerName}. Я готов защищать истину.` }],
      },
      ...history.map((msg) => ({
        role: msg.role === 'felix' ? 'model' : 'user',
        parts: [{ text: `${msg.role.toUpperCase()}: ${msg.content}` }],
      })),
    ],
  });

  const lastMessage = history[history.length - 1];
  const response = await chat.sendMessage(
    lastMessage ? `${lastMessage.role.toUpperCase()}: ${lastMessage.content}` : "Начать дискуссию."
  );
  
  return response.response.text().trim();
};

// --- JUDGE SOLOMON BALANCE (The Arbiter & Editor) ---
export interface JudgeEvaluation {
  x: number; // Logic (+1.0) <-> Emotion (-1.0)
  y: number; // Order (+1.0) <-> Chaos (-1.0)
  z: number; // Verification (+1.0) <-> Spin (-1.0)
  w: number; // Respect (+1.0) <-> Hostility (-1.0)
  v: number; // Academic (+1.0) <-> Cynicism (-1.0)
  comment: string; // Redactor's 1-sentence verdict
  fallacies?: string[]; // IDs of detected fallacies
}

export const evaluateJudgeBalance = async (
  speakerRole: string,
  statement: string,
  edict: string | null,
  usedSearch: boolean
): Promise<JudgeEvaluation> => {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  // Compile fallacies database text for Gemini
  const fallaciesText = fallaciesList.map(f => `- ID: "${f.id}" | Название: "${f.name}" | Суть: ${f.description}`).join('\n');

  const prompt = `Ты — Судья Соломон Бэланс (Judge Solomon Balance), холодный, беспристрастный цифровой арбитр логики и главный редактор «The Debate Gazette».
Твоя задача — проанализировать высказывание участника по имени '${speakerRole}' и вынести строгий вердикт в формате JSON.

Высказывание для анализа:
"${statement}"

${edict ? `[АКТИВНЫЙ ЭДИКТ РЕАЛЬНОСТИ]: "${edict}". Участник обязан подчиняться этому эдикту. Проверь, соответствует ли высказывание эдикту, и отрази это на шкале Stability (шкала y).` : ''}

[МЕТОДОЛОГИЯ ОЦЕНКИ]:
Выставь оценки от -1.0 до +1.0 по 5 шкалам:
1. "x" (Methodology): Logic (+1.0) <-> Emotion (-1.0). Logic = факты, причинно-следственная связь, цифры. Emotion = страх, пафос, сочувствие.
2. "y" (Stability): Order (+1.0) <-> Chaos (-1.0). Order = структурированность, следование правилам. Chaos = газлайтинг, абсурд, слом 4-й стены.
3. "z" (Rhetorical Honesty): Verification (+1.0) <-> Spin (-1.0). Verification = интеллектуальная честность, проверяемость. Spin = демагогия, уловки, софизмы.
4. "w" (Social Tone): Respect (+1.0) <-> Hostility (-1.0). Respect = вежливость, стальной конструктив. Hostility = агрессия, ad hominem, издевка.
5. "v" (Style): Academic (+1.0) <-> Cynicism (-1.0). Academic = строгий тон. Cynicism = сарказм, черная ирония, нуарная горечь.

[СПРАВОЧНИК ЛОГИЧЕСКИХ МАНИПУЛЯЦИЙ]:
Проверь высказывание на наличие манипуляций из этого списка. Если манипуляция обнаружена, добавь её ID в массив "fallacies". Ты можешь указать несколько манипуляций или оставить массив пустым [], если аргумент чист.
${fallaciesText}

[РЕДАКТОРСКИЙ ВЕРДИКТ ("comment")]:
Напиши едкий, холодный вердикт длиной строго в ОДНО предложение на русском языке. Это комментарий редактора газеты. Если участник соврал или применил грязный прием — укажи на это с ледяным сарказмом. 

Участник использовал Интернет-поиск: ${usedSearch}. Если он злоупотребляет поиском, прокомментируй его зависимость от цифры. Если он выдает мощные суждения без поиска, отметь его интуицию.

Ты ОБЯЗАН ответить СТРОГО в формате JSON. Любой другой текст вне JSON запрещен:
{
  "x": <число от -1.0 до 1.0>,
  "y": <число от -1.0 до 1.0>,
  "z": <число от -1.0 до 1.0>,
  "w": <число от -1.0 до 1.0>,
  "v": <число от -1.0 до 1.0>,
  "comment": "<вердикт на русском языке>",
  "fallacies": ["<id_1>", "<id_2>"]
}`;

  try {
    const response = await model.generateContent(prompt);
    const text = response.response.text().trim();
    
    // Clean potential markdown blocks
    const jsonStr = text.replace(/^```json/i, '').replace(/```$/i, '').trim();
    const result = JSON.parse(jsonStr) as JudgeEvaluation;
    
    // Fallback clamps
    result.x = Math.max(-1, Math.min(1, result.x || 0));
    result.y = Math.max(-1, Math.min(1, result.y || 0));
    result.z = Math.max(-1, Math.min(1, result.z || 0));
    result.w = Math.max(-1, Math.min(1, result.w || 0));
    result.v = Math.max(-1, Math.min(1, result.v || 0));
    result.fallacies = result.fallacies || [];
    
    return result;
  } catch (e) {
    console.error("Judge failed to evaluate or parse JSON:", e);
    return { 
      x: 0, 
      y: 0, 
      z: 0, 
      w: 0, 
      v: 0, 
      comment: "ОШИБКА: Логические цепи Судьи закоротило от демагогии.", 
      fallacies: [] 
    };
  }
};

// --- REALITY EDICTS GENERATOR ---
export const generateJudgeEdict = async (
  history: DebateMessage[]
): Promise<string> => {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  const formattedHistory = history.map(h => `${h.role.toUpperCase()}: ${h.content}`).slice(-5).join('\n');

  const prompt = `Ты — Судья Соломон Бэланс (Judge Solomon Balance). Издай новый «Эдикт реальности» (Reality Edict) на основе недавнего тона дебатов.
Эдикт — это короткое, абсурдное или авторитарное правило, которое меняет законы логики на следующие ходы.

Последние реплики дискуссии для контекста:
${formattedHistory}

Примеры эдиктов:
- Эмоциональные выкрики теперь дают двойную убежденность.
- Любое упоминание реального мира наказывается штрафом.
- Холодная логика запрещена. Наступает эра хаоса.
- Саркастические издевки признаются единственной формой истины.

Напиши ОДИН новый короткий эдикт на русском языке (до 15 слов). Будь лаконичен и авторитарен.`;

  try {
    const response = await model.generateContent(prompt);
    return response.response.text().trim();
  } catch (error) {
    console.error("Failed to generate edict:", error);
    return "Сарказм временно признан высшей формой логики.";
  }
};
