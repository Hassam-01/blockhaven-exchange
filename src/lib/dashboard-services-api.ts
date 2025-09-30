// Dashboard Services API - Admin-only endpoints

import { API_CONFIG, getHeaders, HTTP_METHODS } from './api-config';

// Import types from user services
import type {
  FAQ,
  CreateFAQRequest,
  UpdateFAQRequest,
  Testimonial,
  ServiceFeeConfig,
  SetServiceFeeRequest,
  ServiceFeeCalculation,
} from './user-services-api';

// Additional types for admin endpoints
export interface FAQStats {
  total: number;
  active: number;
  inactive: number;
}

export interface TestimonialStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  averageRating: number;
  ratingBreakdown: {
    rating: number;
    count: number;
  }[];
}

export interface ServiceFeeStats {
  totalFeesCollected: number;
  averageFeePercentage: number;
  totalTransactions: number;
  currentConfiguration: ServiceFeeConfig;
}

export interface ServiceFeeHistory {
  id: string;
  percentage: number;
  created_at: string;
  created_by: string;
}

export interface BulkStatusRequest {
  ids: string[];
  status: boolean;
}

export interface BulkTestimonialRequest {
  ids: string[];
}

// Utility function to get auth headers
const getAuthHeaders = (token: string) => getHeaders(token);

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
// FAQ ADMIN ENDPOINTS
// =============================================================================

export const getAllFAQs = async (
  token: string,
  isActive?: boolean,
  search?: string
): Promise<FAQ[]> => {
  const params = new URLSearchParams();
  if (isActive !== undefined) params.append('is_active', isActive.toString());
  if (search) params.append('search', search);
  
  const queryString = params.toString();
  const endpoint = `${API_CONFIG.ENDPOINTS.FAQS.BASE}${queryString ? `?${queryString}` : ''}`;
  
  return apiCall<FAQ[]>(endpoint, {
    method: HTTP_METHODS.GET,
    headers: getAuthHeaders(token),
  });
};

export const createFAQ = async (token: string, data: CreateFAQRequest): Promise<FAQ> => {
  return apiCall<FAQ>(API_CONFIG.ENDPOINTS.FAQS.BASE, {
    method: HTTP_METHODS.POST,
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
};

export const updateFAQ = async (
  token: string,
  id: string,
  data: UpdateFAQRequest
): Promise<FAQ> => {
  return apiCall<FAQ>(`${API_CONFIG.ENDPOINTS.FAQS.BASE}/${id}`, {
    method: HTTP_METHODS.PUT,
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
};

export const deleteFAQ = async (
  token: string,
  id: string
): Promise<{ success: boolean; message: string }> => {
  return apiCall<{ success: boolean; message: string }>(`${API_CONFIG.ENDPOINTS.FAQS.BASE}/${id}`, {
    method: HTTP_METHODS.DELETE,
    headers: getAuthHeaders(token),
  });
};

export const toggleFAQStatus = async (
  token: string,
  id: string
): Promise<FAQ> => {
  return apiCall<FAQ>(`${API_CONFIG.ENDPOINTS.FAQS.BASE}/${id}/toggle`, {
    method: HTTP_METHODS.PATCH,
    headers: getAuthHeaders(token),
  });
};

export const pauseFAQ = async (token: string, id: string): Promise<FAQ> => {
  return apiCall<FAQ>(`${API_CONFIG.ENDPOINTS.FAQS.BASE}/${id}/pause`, {
    method: HTTP_METHODS.PATCH,
    headers: getAuthHeaders(token),
  });
};

export const activateFAQ = async (token: string, id: string): Promise<FAQ> => {
  return apiCall<FAQ>(`${API_CONFIG.ENDPOINTS.FAQS.BASE}/${id}/activate`, {
    method: HTTP_METHODS.PATCH,
    headers: getAuthHeaders(token),
  });
};

export const getFAQStats = async (token: string): Promise<FAQStats> => {
  return apiCall<FAQStats>(API_CONFIG.ENDPOINTS.FAQS.ADMIN_STATS, {
    method: HTTP_METHODS.GET,
    headers: getAuthHeaders(token),
  });
};

export const bulkUpdateFAQStatus = async (
  token: string,
  data: BulkStatusRequest
): Promise<{ success: boolean; updated: number; message: string }> => {
  return apiCall<{ success: boolean; updated: number; message: string }>(API_CONFIG.ENDPOINTS.FAQS.BULK_STATUS, {
    method: HTTP_METHODS.POST,
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
};

// =============================================================================
// TESTIMONIAL ADMIN ENDPOINTS
// =============================================================================

export const getAllTestimonials = async (
  token: string,
  isApproved?: boolean,
  rating?: number,
  userId?: string
): Promise<Testimonial[]> => {
  const params = new URLSearchParams();
  if (isApproved !== undefined) params.append('is_approved', isApproved.toString());
  if (rating !== undefined) params.append('rating', rating.toString());
  if (userId) params.append('userId', userId);
  
  const queryString = params.toString();
  const endpoint = `${API_CONFIG.ENDPOINTS.TESTIMONIALS.BASE}${queryString ? `?${queryString}` : ''}`;
  
  return apiCall<Testimonial[]>(endpoint, {
    method: HTTP_METHODS.GET,
    headers: getAuthHeaders(token),
  });
};

export const getPendingTestimonials = async (token: string): Promise<Testimonial[]> => {
  return apiCall<Testimonial[]>(API_CONFIG.ENDPOINTS.TESTIMONIALS.ADMIN_PENDING, {
    method: HTTP_METHODS.GET,
    headers: getAuthHeaders(token),
  });
};

export const getTestimonialStats = async (token: string): Promise<TestimonialStats> => {
  return apiCall<TestimonialStats>(API_CONFIG.ENDPOINTS.TESTIMONIALS.ADMIN_STATS, {
    method: HTTP_METHODS.GET,
    headers: getAuthHeaders(token),
  });
};

export const approveTestimonial = async (
  token: string,
  id: string
): Promise<Testimonial> => {
  return apiCall<Testimonial>(`${API_CONFIG.ENDPOINTS.TESTIMONIALS.BASE}/${id}/approve`, {
    method: HTTP_METHODS.PATCH,
    headers: getAuthHeaders(token),
  });
};

export const rejectTestimonial = async (
  token: string,
  id: string
): Promise<Testimonial> => {
  return apiCall<Testimonial>(`${API_CONFIG.ENDPOINTS.TESTIMONIALS.BASE}/${id}/reject`, {
    method: HTTP_METHODS.PATCH,
    headers: getAuthHeaders(token),
  });
};

export const bulkApproveTestimonials = async (
  token: string,
  data: BulkTestimonialRequest
): Promise<{ success: boolean; approved: number; message: string }> => {
  return apiCall<{ success: boolean; approved: number; message: string }>(API_CONFIG.ENDPOINTS.TESTIMONIALS.BULK_APPROVE, {
    method: HTTP_METHODS.POST,
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
};

export const bulkRejectTestimonials = async (
  token: string,
  data: BulkTestimonialRequest
): Promise<{ success: boolean; rejected: number; message: string }> => {
  return apiCall<{ success: boolean; rejected: number; message: string }>(API_CONFIG.ENDPOINTS.TESTIMONIALS.BULK_REJECT, {
    method: HTTP_METHODS.POST,
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
};

// =============================================================================
// SERVICE FEE ADMIN ENDPOINTS
// =============================================================================

export const updateServiceFeeConfig = async (
  token: string,
  data: { type: 'fixed-rate' | 'floating'; percentage: number }
): Promise<ServiceFeeConfig> => {
  return apiCall<ServiceFeeConfig>(API_CONFIG.ENDPOINTS.SERVICE_FEES.BASE, {
    method: HTTP_METHODS.PUT,
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
};

export const setFloatingRate = async (
  token: string,
  data: { percentage: number }
): Promise<ServiceFeeConfig> => {
  return updateServiceFeeConfig(token, { type: 'floating', percentage: data.percentage });
};

export const setFixedRate = async (
  token: string,
  data: { percentage: number }
): Promise<ServiceFeeConfig> => {
  return updateServiceFeeConfig(token, { type: 'fixed-rate', percentage: data.percentage });
};

export const getServiceFeeHistory = async (token: string): Promise<ServiceFeeHistory[]> => {
  return apiCall<ServiceFeeHistory[]>(API_CONFIG.ENDPOINTS.SERVICE_FEES.HISTORY, {
    method: HTTP_METHODS.GET,
    headers: getAuthHeaders(token),
  });
};

export const getServiceFeeStats = async (token: string): Promise<ServiceFeeStats> => {
  return apiCall<ServiceFeeStats>(API_CONFIG.ENDPOINTS.SERVICE_FEES.STATS, {
    method: HTTP_METHODS.GET,
    headers: getAuthHeaders(token),
  });
};

export const getCurrentServiceFeeConfig = async (token: string): Promise<ServiceFeeConfig> => {
  return apiCall<ServiceFeeConfig>(API_CONFIG.ENDPOINTS.SERVICE_FEES.BASE, {
    method: HTTP_METHODS.GET,
    headers: getAuthHeaders(token),
  });
};

// Legacy functions for backward compatibility - now use the unified config
export const getCurrentFixedRate = async (token: string): Promise<{ percentage: number }> => {
  const config = await getCurrentServiceFeeConfig(token);
  return { percentage: config.percentage || 0 };
};

export const getCurrentFloatingRate = async (token: string): Promise<{ percentage: number }> => {
  const config = await getCurrentServiceFeeConfig(token);
  return { percentage: config.percentage || 0 };
};

export const resetServiceFeeConfig = async (
  token: string
): Promise<ServiceFeeConfig> => {
  return apiCall<ServiceFeeConfig>(API_CONFIG.ENDPOINTS.SERVICE_FEES.RESET, {
    method: HTTP_METHODS.POST,
    headers: getAuthHeaders(token),
  });
};

export const validateServiceFeeConfig = async (
  token: string,
  data: SetServiceFeeRequest
): Promise<{ valid: boolean; message: string; config?: ServiceFeeConfig }> => {
  return apiCall<{ valid: boolean; message: string; config?: ServiceFeeConfig }>(API_CONFIG.ENDPOINTS.SERVICE_FEES.VALIDATE, {
    method: HTTP_METHODS.POST,
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
};

// =============================================================================
// UTILITY FUNCTIONS FOR ADMIN DASHBOARD
// =============================================================================

// Function to handle API errors with user-friendly messages
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

// Function to check if user has admin privileges (based on token payload)
export const checkAdminAccess = async (token: string): Promise<boolean> => {
  try {
    // This would typically decode the JWT token to check user role
    // For now, we'll make a simple API call to verify admin access
    await apiCall(API_CONFIG.ENDPOINTS.USERS.PROFILE, {
      method: HTTP_METHODS.GET,
      headers: getAuthHeaders(token),
    });
    return true;
  } catch {
    return false;
  }
};

// Function to format dates consistently across the dashboard
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Function to format percentage values
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

// Function to format currency values
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};
