import apiClient from '@/lib/axiosClients';

export interface StartSessionPayload {
  helperId: string;
  lostId: string;
}

export interface StartSessionResponse {
  sessionId: string;
  route: Record<string, unknown>;
  wsChannel: string;
  existing?: boolean;
  message?: string;
}

export async function startSession(payload: StartSessionPayload): Promise<StartSessionResponse> {
  try {
    // First, check if there's already an active session for this lost person
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3010/api';
    const checkResponse = await apiClient.get(`/gfl/profiles/${payload.lostId}/sessions/active`);
    
    if (checkResponse.data && (checkResponse.data.sessionId || (checkResponse.data.sessions && checkResponse.data.sessions.length > 0))) {
      // There's already an active session
      throw new Error('ACTIVE_SESSION_EXISTS');
    }
    
    // If no active session, proceed to create new one
    const res = await apiClient.post<StartSessionResponse>('/start-session', payload, {
      timeout: 15000 // 15 second timeout
    });
    
    // Broadcast session start event for better coordination
    window.dispatchEvent(new CustomEvent('sessionStarted', {
      detail: { 
        sessionId: res.data.sessionId,
        helperId: payload.helperId,
        lostId: payload.lostId
      }
    }));
    
    return res.data;
  } catch (error) {
    // Enhanced error handling for session conflicts
    const err = error as { message?: string; response?: { status?: number; data?: { message?: string } } };
    
    if (err.message === 'ACTIVE_SESSION_EXISTS') {
      // Custom error for active session conflict
      throw new Error('ACTIVE_SESSION_EXISTS');
    } else if (err.response?.status === 409) {
      // Backend detected session conflict
      throw new Error('ACTIVE_SESSION_EXISTS');
    } else if (err.response?.status === 404) {
      // Lost person not found
      throw new Error('PROFILE_NOT_FOUND');
    } else if (err.response?.status && err.response.status >= 500) {
      // Server error
      throw new Error('SERVER_ERROR');
    }
    
    // Re-throw original error for other cases
    throw error;
  }
}
