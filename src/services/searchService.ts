export const getRealWorldContext = async (userHandle: string = '@ABOCb'): Promise<string> => {
  const apiKey = import.meta.env.VITE_TAVILY_API_KEY;

  if (!apiKey) {
    // Mock response if no API key
    await new Promise(resolve => setTimeout(resolve, 1200));
    return "[ДАННЫЕ: 29 апреля 2026 года. В Тель-Авиве вечерний бриз. Индекс Доу-Джонса нестабилен.]";
  }

  const query = `Search for mentions of ${userHandle} on X (Twitter) and general trends in Israel for April 29, 2026.`;

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: "basic",
        include_answer: false,
        max_results: 3
      })
    });

    if (!response.ok) {
      throw new Error(`Tavily API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract content from top results
    const resultsContext = data.results
      ?.map((r: any) => r.content)
      .join(' ') || '';

    return resultsContext || "[НЕТ АКТУАЛЬНЫХ ДАННЫХ]";
  } catch (error) {
    console.error("Search API error:", error);
    return "[ОШИБКА ПОЛУЧЕНИЯ ДАННЫХ РЕАЛЬНОСТИ]";
  }
};
