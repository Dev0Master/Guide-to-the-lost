import apiClient from '@/lib/axiosClients';

export interface StartSessionPayload {
  helperId: string;
  lostId: string;
}

export interface StartSessionResponse {
  sessionId: string;
  route: Record<string, unknown>;
  wsChannel: string;
}

export async function startSession(payload: StartSessionPayload) {
  const res = await apiClient.post<StartSessionResponse>('/start-session', payload);
  return res.data;
}
