export async function getCurrentTime(): Promise<string> {
  return new Date().toISOString()
}