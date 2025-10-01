// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  ENDPOINTS: {
    // User endpoints
    USERS: {
      SIGNUP: '/api/users/signup',
      LOGIN: '/api/users/login',
      PROFILE: '/api/users/profile',
      PASSWORD: '/api/users/password',
    },
    // FAQ endpoints
    FAQS: {
      PUBLIC: '/api/faqs/public',
      SEARCH: '/api/faqs/search',
      BASE: '/api/faqs',
      ADMIN_STATS: '/api/faqs/admin/stats',
      BULK_STATUS: '/api/faqs/bulk/status',
    },
    // Testimonial endpoints
    TESTIMONIALS: {
      PUBLIC: '/api/testimonials/public',
      MY: '/api/testimonials/my',
      BASE: '/api/testimonials',
      ADMIN_PENDING: '/api/testimonials/admin/pending',
      ADMIN_STATS: '/api/testimonials/admin/stats',
      BULK_APPROVE: '/api/testimonials/bulk/approve',
      BULK_REJECT: '/api/testimonials/bulk/reject',
    },
    // Service fee endpoints
    SERVICE_FEES: {
      CURRENT: '/api/service-fees/current',
      CALCULATE: '/api/service-fees/calculate',
      CALCULATE_BASE: '/api/service-fees/calculate-base',
      BASE: '/api/service-fees',
      SET_FLOATING: '/api/service-fees/set-floating',
      SET_FIXED: '/api/service-fees/set-fixed',
      HISTORY: '/api/service-fees/history',
    //   STATS: '/api/service-fees/stats',
      RESET: '/api/service-fees/reset',
      VALIDATE: '/api/service-fees/validate',
    },
    // Contact endpoint
    CONTACT: '/api/contact',
  },
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

// Common headers
export const getHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Response status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;