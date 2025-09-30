# BlockHaven Exchange API Client

This directory contains TypeScript client libraries for interacting with the BlockHaven Exchange backend APIs.

## Files Overview

- **`user-services-api.ts`** - Public and authenticated user endpoints
- **`dashboard-services-api.ts`** - Admin-only endpoints for dashboard management  
- **`api-config.ts`** - Centralized API configuration and constants
- **`api-examples.ts`** - Complete usage examples and workflows

## Configuration

### Environment Variables

Set the API base URL using the environment variable:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

If not set, it defaults to `http://localhost:3000`.

### API Configuration

The API configuration is centralized in `api-config.ts`:

```typescript
import { API_CONFIG } from './lib/api-config';

// Access base URL
console.log(API_CONFIG.BASE_URL); // http://localhost:3000

// Access endpoints
console.log(API_CONFIG.ENDPOINTS.USERS.SIGNUP); // /api/users/signup
```

## User Services API

### Authentication

```typescript
import { userSignup, userLogin, getUserProfile } from './lib/user-services-api';

// Sign up a new user
const signupResponse = await userSignup({
  email: 'user@example.com',
  password: 'password123',
  first_name: 'John',
  last_name: 'Doe',
  user_type: 'customer'
});

// Login user
const loginResponse = await userLogin({
  email: 'user@example.com',
  password: 'password123'
});

const token = loginResponse.token;

// Get user profile
const profile = await getUserProfile(token);
```

### FAQ Management (User)

```typescript
import { getPublicFAQs, searchFAQs, getFAQById } from './lib/user-services-api';

// Get public FAQs
const faqs = await getPublicFAQs();

// Search FAQs
const searchResults = await searchFAQs('exchange', true);

// Get specific FAQ (requires authentication)
const faq = await getFAQById(token, 'faq-id');
```

### Testimonials (User)

```typescript
import { 
  getPublicTestimonials,
  createTestimonial,
  updateTestimonial,
  getMyTestimonial 
} from './lib/user-services-api';

// Get public testimonials
const testimonials = await getPublicTestimonials(5); // 5-star only

// Create testimonial
const newTestimonial = await createTestimonial(token, {
  rating: 5,
  text: 'Great service!'
});

// Get my testimonial
const myTestimonial = await getMyTestimonial(token);
```

### Service Fees (Public)

```typescript
import { 
  getCurrentServiceFee,
  calculateServiceFee,
  calculateBaseAmount 
} from './lib/user-services-api';

// Get current fee configuration
const feeConfig = await getCurrentServiceFee();

// Calculate fee for amount
const calculation = await calculateServiceFee(1000);
console.log(`Fee: $${calculation.service_fee}`);

// Calculate base amount from total
const baseCalc = await calculateBaseAmount(1025);
console.log(`Base: $${baseCalc.base_amount}`);
```

## Dashboard Services API (Admin Only)

### FAQ Management (Admin)

```typescript
import { 
  getAllFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getFAQStats,
  bulkUpdateFAQStatus 
} from './lib/dashboard-services-api';

// Get all FAQs with filters
const allFAQs = await getAllFAQs(adminToken, true, 'search term');

// Create FAQ
const newFAQ = await createFAQ(adminToken, {
  question: 'How to start?',
  answer: 'Follow our guide.',
  is_active: true
});

// Get FAQ statistics
const stats = await getFAQStats(adminToken);
console.log(`Total: ${stats.total}, Active: ${stats.active}`);

// Bulk update status
await bulkUpdateFAQStatus(adminToken, {
  ids: ['faq-1', 'faq-2'],
  status: true
});
```

### Testimonial Management (Admin)

```typescript
import { 
  getAllTestimonials,
  getPendingTestimonials,
  approveTestimonial,
  rejectTestimonial,
  getTestimonialStats,
  bulkApproveTestimonials 
} from './lib/dashboard-services-api';

// Get all testimonials with filters
const testimonials = await getAllTestimonials(adminToken, false, 4);

// Get pending testimonials
const pending = await getPendingTestimonials(adminToken);

// Approve testimonial
await approveTestimonial(adminToken, 'testimonial-id');

// Get statistics
const testimonialStats = await getTestimonialStats(adminToken);
console.log(`Average Rating: ${testimonialStats.averageRating}`);

// Bulk approve
await bulkApproveTestimonials(adminToken, {
  ids: ['test-1', 'test-2']
});
```

### Service Fee Management (Admin)

```typescript
import { 
  setFloatingRate,
  setFixedRate,
  getServiceFeeHistory,
  getServiceFeeStats,
  validateServiceFeeConfig 
} from './lib/dashboard-services-api';

// Set floating rate
const newConfig = await setFloatingRate(adminToken, {
  percentage: 2.5
});

// Validate configuration before setting
const validation = await validateServiceFeeConfig(adminToken, {
  percentage: 3.0
});

if (validation.valid) {
  await setFixedRate(adminToken, { percentage: 3.0 });
}

// Get statistics
const feeStats = await getServiceFeeStats(adminToken);
console.log(`Total Collected: $${feeStats.totalFeesCollected}`);

// Get history
const history = await getServiceFeeHistory(adminToken);
```

## Error Handling

All API functions throw errors that can be caught and handled:

```typescript
import { handleApiError } from './lib/dashboard-services-api';

try {
  const result = await someApiCall();
} catch (error) {
  const errorMessage = handleApiError(error);
  console.error('API Error:', errorMessage);
  // Display user-friendly error message
}
```

## Utility Functions

### Admin Access Check

```typescript
import { checkAdminAccess } from './lib/dashboard-services-api';

const isAdmin = await checkAdminAccess(token);
if (isAdmin) {
  // Show admin features
}
```

### Formatting Utilities

```typescript
import { 
  formatDate,
  formatPercentage,
  formatCurrency 
} from './lib/dashboard-services-api';

console.log(formatDate('2023-12-01T10:30:00Z')); // Dec 1, 2023, 10:30 AM
console.log(formatPercentage(2.5)); // 2.50%
console.log(formatCurrency(1000)); // $1,000.00
```

## Complete Example

See `api-examples.ts` for a complete workflow example:

```typescript
import { examples } from './lib/api-examples';

// Run complete workflow
await examples.completeWorkflow();

// Run specific examples
await examples.userAuthentication();
await examples.faqManagement(userToken, adminToken);
await examples.testimonialManagement(userToken, adminToken);
await examples.serviceFeeManagement(adminToken);
```

## API Endpoints Reference

### User Endpoints
- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login  
- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update user profile (authenticated)
- `PUT /api/users/password` - Update password (authenticated)

### FAQ Endpoints
- `GET /api/faqs/public` - Get public FAQs
- `GET /api/faqs/search` - Search FAQs
- `GET /api/faqs/:id` - Get FAQ by ID (authenticated)
- `GET /api/faqs` - Get all FAQs (admin)
- `POST /api/faqs` - Create FAQ (admin)
- `PUT /api/faqs/:id` - Update FAQ (admin)
- `DELETE /api/faqs/:id` - Delete FAQ (admin)
- `PATCH /api/faqs/:id/toggle` - Toggle FAQ status (admin)
- `GET /api/faqs/admin/stats` - Get FAQ statistics (admin)
- `POST /api/faqs/bulk/status` - Bulk update FAQ status (admin)

### Testimonial Endpoints  
- `GET /api/testimonials/public` - Get approved testimonials
- `GET /api/testimonials/my` - Get user's testimonial (authenticated)
- `POST /api/testimonials` - Create testimonial (authenticated)
- `PUT /api/testimonials/:id` - Update testimonial (authenticated)
- `DELETE /api/testimonials/:id` - Delete testimonial (authenticated)
- `GET /api/testimonials` - Get all testimonials (admin)
- `GET /api/testimonials/admin/pending` - Get pending testimonials (admin)
- `PATCH /api/testimonials/:id/approve` - Approve testimonial (admin)
- `PATCH /api/testimonials/:id/reject` - Reject testimonial (admin)
- `GET /api/testimonials/admin/stats` - Get testimonial statistics (admin)
- `POST /api/testimonials/bulk/approve` - Bulk approve testimonials (admin)

### Service Fee Endpoints
- `GET /api/service-fees/current` - Get current fee configuration
- `GET /api/service-fees/calculate` - Calculate service fee
- `GET /api/service-fees/calculate-base` - Calculate base amount
- `PUT /api/service-fees` - Update fee configuration (admin)
- `POST /api/service-fees/set-floating` - Set floating rate (admin)
- `POST /api/service-fees/set-fixed` - Set fixed rate (admin)
- `GET /api/service-fees/history` - Get fee history (admin)
- `GET /api/service-fees/stats` - Get fee statistics (admin)
- `POST /api/service-fees/reset` - Reset to default (admin)
- `POST /api/service-fees/validate` - Validate configuration (admin)

## TypeScript Types

All request/response types are fully typed and exported from the respective API files. Import them as needed:

```typescript
import type { 
  User,
  SignupRequest,
  LoginRequest,
  FAQ,
  Testimonial,
  ServiceFeeConfig 
} from './lib/user-services-api';

import type {
  FAQStats,
  TestimonialStats,
  ServiceFeeStats 
} from './lib/dashboard-services-api';
```