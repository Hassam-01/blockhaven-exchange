import { API_CONFIG, getHeaders, HTTP_METHODS } from './api-config';

export interface ChatQueryData {
  email: string;
  query: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
}

/**
 * Submit a chat query
 */
export const submitChatQuery = async (queryData: ChatQueryData): Promise<ChatResponse> => {
  try {
    // For now, we'll use the same contact endpoint but we can create a separate chat endpoint later
    const contactData = {
      name: 'Chat User',
      email: queryData.email,
      phone: '',
      subject: 'Chat Query',
      message: queryData.query
    };

    const headers = {
      "Content-Type": "application/json",
      ...getHeaders(),
    } as Record<string, string>;

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTACT}`, {
      method: HTTP_METHODS.POST,
      headers,
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting chat query:', error);
    throw error;
  }
};