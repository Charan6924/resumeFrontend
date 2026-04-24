const STORAGE_KEY = 'resume-screener-settings';

export interface SearchSettings {
  apiKey: string;
  systemPrompt: string | null;
}

export function getSearchSettings(): SearchSettings {
  if (typeof window === 'undefined') return { apiKey: '', systemPrompt: null };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { apiKey: '', systemPrompt: null };
    const parsed = JSON.parse(stored);
    const apiKey = typeof parsed.apiKey === 'string' ? parsed.apiKey : '';
    const systemPrompt = typeof parsed.systemPrompt === 'string' && parsed.systemPrompt ? parsed.systemPrompt : null;
    return { apiKey, systemPrompt };
  } catch {
    return { apiKey: '', systemPrompt: null };
  }
}

export function mapSearchError(status: number, body: string): string | null {
  if (status >= 200 && status < 300) return null;
  if (status === 401) return 'Invalid API key. Please check your key in Settings.';
  if (status === 402) return 'Your API key has run out of credits.';
  const lower = body.toLowerCase();
  if (status === 429 && (lower.includes('insufficient_quota') || lower.includes('quota'))) {
    return 'Your API key has run out of credits.';
  }
  return `Search failed (${status})`;
}
