import { API_CONFIG, getHeaders, HTTP_METHODS } from './api-config';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string; // Make phone optional
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

/**
 * Submit a contact form
 */
export const submitContactForm = async (formData: ContactFormData): Promise<ContactResponse> => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...getHeaders(),
    } as Record<string, string>;

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTACT}`, {
      method: HTTP_METHODS.POST,
      headers,
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};