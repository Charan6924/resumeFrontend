import { getSearchSettings, mapSearchError } from '../search-guard';

const STORAGE_KEY = 'resume-screener-settings';

describe('getSearchSettings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty apiKey and null systemPrompt when localStorage is empty', () => {
    const result = getSearchSettings();
    expect(result.apiKey).toBe('');
    expect(result.systemPrompt).toBeNull();
  });

  it('returns apiKey from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ apiKey: 'sk-test-123', autoSave: false, systemPrompt: '' }));
    const result = getSearchSettings();
    expect(result.apiKey).toBe('sk-test-123');
  });

  it('returns systemPrompt from localStorage when set', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ apiKey: 'sk-abc', autoSave: false, systemPrompt: 'Focus on Python.' }));
    const result = getSearchSettings();
    expect(result.systemPrompt).toBe('Focus on Python.');
  });

  it('returns null systemPrompt when systemPrompt is empty string', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ apiKey: 'sk-abc', autoSave: false, systemPrompt: '' }));
    const result = getSearchSettings();
    expect(result.systemPrompt).toBeNull();
  });

  it('returns empty apiKey when stored value has no apiKey field', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ autoSave: true }));
    const result = getSearchSettings();
    expect(result.apiKey).toBe('');
  });

  it('returns empty apiKey when localStorage contains invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json{{{');
    const result = getSearchSettings();
    expect(result.apiKey).toBe('');
  });
});

describe('mapSearchError', () => {
  it('returns null for a 200 ok response', () => {
    expect(mapSearchError(200, '')).toBeNull();
  });

  it('returns invalid key message for 401', () => {
    const msg = mapSearchError(401, '');
    expect(msg).toMatch(/invalid api key/i);
    expect(msg).toMatch(/settings/i);
  });

  it('returns quota message for 402', () => {
    const msg = mapSearchError(402, '');
    expect(msg).toMatch(/run out of credits/i);
  });

  it('returns quota message when body contains insufficient_quota', () => {
    const msg = mapSearchError(429, 'insufficient_quota exceeded');
    expect(msg).toMatch(/run out of credits/i);
  });

  it('returns quota message when body contains quota keyword', () => {
    const msg = mapSearchError(429, 'You have exceeded your quota');
    expect(msg).toMatch(/run out of credits/i);
  });

  it('returns generic error for other status codes', () => {
    const msg = mapSearchError(500, 'internal error');
    expect(msg).toMatch(/500/);
  });

  it('returns generic error for 404', () => {
    const msg = mapSearchError(404, '');
    expect(msg).toMatch(/404/);
  });
});
