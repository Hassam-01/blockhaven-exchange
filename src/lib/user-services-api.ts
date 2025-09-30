// User Services API - Public and authenticated user endpoints

import { API_CONFIG, getHeaders, HTTP_METHODS } from './api-config';

// Types for User Services
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'customer' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  user_type: 'customer' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface UpdatePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateFAQRequest {
  question: string;
  answer: string;
  is_active?: boolean;
}

export interface UpdateFAQRequest {
  question?: string;
  answer?: string;
  is_active?: boolean;
}

export interface Testimonial {
  id: string;
  user_id: string;
  rating: number;
  text: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    first_name: string;
    last_name: string;
  };
}

export interface CreateTestimonialRequest {
  rating: number;
  text: string;
}

export interface UpdateTestimonialRequest {
  rating?: number;
  text?: string;
}

export interface ServiceFeeConfig {
  id: string;
  percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceFeeCalculation {
  base_amount: number;
  service_fee: number;
  total_amount: number;
  fee_percentage: number;
}

export interface SetServiceFeeRequest {
  percentage: number;
}

// Utility function to get auth headers
const getAuthHeaders = (token?: string) => getHeaders(token);

// Generic API call function
const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  
  // Check if the response has the expected wrapper structure
  if (result.success === false) {
    throw new Error(result.message || result.error || 'API request failed');
  }
  
  // Return the data directly if it's wrapped, otherwise return the result as-is
  return result.data !== undefined ? result.data : result;
};

// =============================================================================
// USER ENDPOINTS
// =============================================================================

// Public Endpoints
export const userSignup = async (data: SignupRequest): Promise<{ token: string; user: User }> => {
  return apiCall<{ token: string; user: User }>(API_CONFIG.ENDPOINTS.USERS.SIGNUP, {
    method: HTTP_METHODS.POST,
    body: JSON.stringify(data),
  });
};

export const userLogin = async (data: LoginRequest): Promise<{ token: string; user: User }> => {
  return apiCall<{ token: string; user: User }>(API_CONFIG.ENDPOINTS.USERS.LOGIN, {
    method: HTTP_METHODS.POST,
    body: JSON.stringify(data),
  });
};

// Protected Endpoints (Authenticated Users)
export const getUserProfile = async (token: string): Promise<User> => {
  return apiCall<User>(API_CONFIG.ENDPOINTS.USERS.PROFILE, {
    method: HTTP_METHODS.GET,
    headers: getAuthHeaders(token),
  });
};

export const updateUserProfile = async (
  token: string,
  data: UpdateProfileRequest
): Promise<User> => {
  return apiCall<User>(API_CONFIG.ENDPOINTS.USERS.PROFILE, {
    method: HTTP_METHODS.PUT,
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
};

export const updateUserPassword = async (
  token: string,
  data: UpdatePasswordRequest
): Promise<{ success: boolean; message: string }> => {
  return apiCall<{ success: boolean; message: string }>(API_CONFIG.ENDPOINTS.USERS.PASSWORD, {
    method: HTTP_METHODS.PUT,
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
};

// =============================================================================
// FAQ ENDPOINTS
// =============================================================================

// Public Endpoints
export const getPublicFAQs = async (search?: string): Promise<FAQ[]> => {
  const searchParam = search ? `?search=${encodeURIComponent(search)}` : '';
  return apiCall<FAQ[]>(`${API_CONFIG.ENDPOINTS.FAQS.PUBLIC}${searchParam}`);
};

export const searchFAQs = async (
  keyword: string,
  activeOnly: boolean = true
): Promise<FAQ[]> => {
  const params = new URLSearchParams({
    keyword,
    active_only: activeOnly.toString(),
  });
  return apiCall<FAQ[]>(`${API_CONFIG.ENDPOINTS.FAQS.SEARCH}?${params}`);
};

// Protected Endpoints (Authenticated Users)
export const getFAQById = async (token: string, id: string): Promise<FAQ> => {
  return apiCall<FAQ>(`${API_CONFIG.ENDPOINTS.FAQS.BASE}/${id}`, {
    method: HTTP_METHODS.GET,
    headers: getAuthHeaders(token),
  });
};

// =============================================================================
// TESTIMONIAL ENDPOINTS
// =============================================================================

// Public Endpoints
export const getPublicTestimonials = async (rating?: number): Promise<Testimonial[]> => {
  const ratingParam = rating ? `?rating=${rating}` : '';
  return apiCall<Testimonial[]>(`${API_CONFIG.ENDPOINTS.TESTIMONIALS.PUBLIC}${ratingParam}`);
};

// Protected Endpoints (Logged-in Users)
export const getMyTestimonial = async (token: string): Promise<Testimonial | null> => {
  return apiCall<Testimonial | null>(API_CONFIG.ENDPOINTS.TESTIMONIALS.MY, {
    method: HTTP_METHODS.GET,
    headers: getAuthHeaders(token),
  });
};

export const createTestimonial = async (
  token: string,
  data: CreateTestimonialRequest
): Promise<Testimonial> => {
  return apiCall<Testimonial>(API_CONFIG.ENDPOINTS.TESTIMONIALS.BASE, {
    method: HTTP_METHODS.POST,
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
};

export const updateTestimonial = async (
  token: string,
  id: string,
  data: UpdateTestimonialRequest
): Promise<Testimonial> => {
  return apiCall<Testimonial>(`${API_CONFIG.ENDPOINTS.TESTIMONIALS.BASE}/${id}`, {
    method: HTTP_METHODS.PUT,
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
};

export const deleteTestimonial = async (
  token: string,
  id: string
): Promise<{ success: boolean; message: string }> => {
  return apiCall<{ success: boolean; message: string }>(`${API_CONFIG.ENDPOINTS.TESTIMONIALS.BASE}/${id}`, {
    method: HTTP_METHODS.DELETE,
    headers: getAuthHeaders(token),
  });
};

export const getTestimonialById = async (token: string, id: string): Promise<Testimonial> => {
  return apiCall<Testimonial>(`${API_CONFIG.ENDPOINTS.TESTIMONIALS.BASE}/${id}`, {
    method: HTTP_METHODS.GET,
    headers: getAuthHeaders(token),
  });
};

// =============================================================================
// SERVICE FEE ENDPOINTS
// =============================================================================

// Public Endpoints
export const getCurrentServiceFee = async (): Promise<ServiceFeeConfig> => {
  return apiCall<ServiceFeeConfig>(API_CONFIG.ENDPOINTS.SERVICE_FEES.CURRENT);
};

export const calculateServiceFee = async (amount: number): Promise<ServiceFeeCalculation> => {
  return apiCall<ServiceFeeCalculation>(`${API_CONFIG.ENDPOINTS.SERVICE_FEES.CALCULATE}?amount=${amount}`);
};

export const calculateBaseAmount = async (totalAmount: number): Promise<ServiceFeeCalculation> => {
  return apiCall<ServiceFeeCalculation>(`${API_CONFIG.ENDPOINTS.SERVICE_FEES.CALCULATE_BASE}?totalAmount=${totalAmount}`);
};
