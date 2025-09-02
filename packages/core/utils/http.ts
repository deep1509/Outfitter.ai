import axios from 'axios';

export async function httpGet(url: string, headers: Record<string, string> = {}): Promise<string> {
  const res = await axios.get(url, { headers });
  return res.data;
}
