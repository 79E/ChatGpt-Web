export function getAiKey(keysString: string) {
  if (!keysString || typeof keysString !== "string") return "";
  const keys = keysString
    .split(",")
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 0);
  if (keys.length <= 0) return "";
  const api_key = keys[Math.floor(Math.random() * keys.length)];
  return api_key;
}
