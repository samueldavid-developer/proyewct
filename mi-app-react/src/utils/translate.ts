/**
 * Translates text from a source language to a target language using the free MyMemory API.
 * Falls back to the original text if the request fails or is rate limited.
 * 
 * @param text The text to translate
 * @param from The ISO 639-1 code of the source language (e.g., 'es')
 * @param to The ISO 639-1 code of the target language (e.g., 'it')
 * @returns The translated string
 */
export async function translateText(text: string, from: string, to: string): Promise<string> {
  if (!text) return '';
  const cleanFrom = from.split('-')[0].toLowerCase();
  const cleanTo = to.split('-')[0].toLowerCase();

  if (cleanFrom === cleanTo) return text;

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${cleanFrom}|${cleanTo}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Translation API returned non-ok status');
    
    const data = await res.json();
    if (data?.responseData?.translatedText) {
      return data.responseData.translatedText;
    }
    return text;
  } catch (err) {
    console.error('Dynamic translation error:', err);
    return text;
  }
}
