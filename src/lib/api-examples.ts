// Example Usage of User Services and Dashboard Services APIs

import {
  // User authentication
  userSignup,
  userLogin,
  verify2FA,
  enable2FA,
  disable2FA,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  
  // FAQ user endpoints
  getPublicFAQs,
  searchFAQs,
  getFAQById,
  
  // Testimonial user endpoints
  getPublicTestimonials,
  getMyTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  
  // Service fee public endpoints
  getCurrentServiceFee,
  calculateServiceFee,
  calculateBaseAmount,
} from './user-services-api';

import type { User } from './user-services-api';

import {
  // FAQ admin endpoints
  getAllFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  toggleFAQStatus,
  getFAQStats,
  bulkUpdateFAQStatus,
  
  // Testimonial admin endpoints
  getAllTestimonials,
  getPendingTestimonials,
  approveTestimonial,
  rejectTestimonial,
  getTestimonialStats,
  bulkApproveTestimonials,
  
  // Service fee admin endpoints
  updateServiceFeeConfig,
  setFloatingRate,
  setFixedRate,
  getServiceFeeHistory,
  resetServiceFeeConfig,
  validateServiceFeeConfig,
  
  // Utility functions
  handleApiError,
  checkAdminAccess,
  formatDate,
  formatPercentage,
  formatCurrency,
} from './dashboard-services-api';

// =============================================================================
// EXAMPLE USAGE - USER AUTHENTICATION
// =============================================================================

export const exampleUserAuthentication = async () => {
  try {
    // User Signup
    const signupResponse = await userSignup({
      email: 'user@example.com',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe',
      user_type: 'customer',
    });
    
    console.log('User registered:', signupResponse.user);
    const token = signupResponse.token;
    
    // User Login (may require 2FA)
    const loginResponse = await userLogin({
      email: 'user@example.com',
      password: 'password123',
    });
    
    let authToken: string;
    let user: User;
    
    if (loginResponse.requiresTwoFactor && loginResponse.pendingToken) {
      console.log('2FA required, verification code sent to email');
      
      // In a real application, you would get this code from user input
      const verificationCode = '123456'; // Example code
      
      const verify2FAResponse = await verify2FA({
        email: 'user@example.com',
        code: verificationCode,
        pendingToken: loginResponse.pendingToken,
      });
      
      authToken = verify2FAResponse.data.token;
      user = verify2FAResponse.data.user;
      console.log('2FA verification successful:', user);
    } else if (loginResponse.data) {
      authToken = loginResponse.data.token;
      user = loginResponse.data.user;
      console.log('Direct login successful:', user);
    } else {
      throw new Error('Invalid login response');
    }
    
    // Get User Profile
    const profile = await getUserProfile(authToken);
    console.log('User profile:', profile);
    
    // Enable 2FA for the user
    await enable2FA(authToken);
    console.log('Two-factor authentication enabled');
    
    // Disable 2FA for the user (optional)
    // await disable2FA(authToken);
    // console.log('Two-factor authentication disabled');
    
    // Update User Profile
    const updatedProfile = await updateUserProfile(authToken, {
      first_name: 'Jane',
      last_name: 'Smith',
    });
    console.log('Updated profile:', updatedProfile);
    
    // Update Password
    await updateUserPassword(authToken, {
      currentPassword: 'password123',
      newPassword: 'newpassword123',
    });
    console.log('Password updated successfully');
    
  } catch (error) {
    console.error('Authentication error:', handleApiError(error));
  }
};

// =============================================================================
// EXAMPLE USAGE - FAQ MANAGEMENT
// =============================================================================

export const exampleFAQManagement = async (userToken: string, adminToken: string) => {
  try {
    // Public FAQ access (no authentication required)
    const publicFAQs = await getPublicFAQs();
    console.log('Public FAQs:', publicFAQs);
    
    // Search FAQs
    const searchResults = await searchFAQs('exchange', true);
    console.log('Search results:', searchResults);
    
    // User access (authentication required)
    const faqDetails = await getFAQById(userToken, 'faq-id-123');
    console.log('FAQ details:', faqDetails);
    
    // Admin access
    if (await checkAdminAccess(adminToken)) {
      // Get all FAQs with filters
      const allFAQs = await getAllFAQs(adminToken, true, 'exchange');
      console.log('All FAQs:', allFAQs);
      
      // Create new FAQ
      const newFAQ = await createFAQ(adminToken, {
        question: 'How do I start trading?',
        answer: 'Simply sign up and follow our step-by-step guide.',
        is_active: true,
      });
      console.log('New FAQ created:', newFAQ);
      
      // Get FAQ statistics
      const faqStats = await getFAQStats(adminToken);
      console.log('FAQ Stats:', faqStats);
      console.log(`Total: ${faqStats.stats.total}, Active: ${faqStats.stats.active}`);
      
      // Bulk update FAQ status
      await bulkUpdateFAQStatus(adminToken, {
        ids: ['faq-1', 'faq-2', 'faq-3'],
        status: true,
      });
      console.log('Bulk FAQ status update completed');
    }
    
  } catch (error) {
    console.error('FAQ management error:', handleApiError(error));
  }
};

// =============================================================================
// EXAMPLE USAGE - TESTIMONIAL MANAGEMENT
// =============================================================================

export const exampleTestimonialManagement = async (userToken: string, adminToken: string) => {
  try {
    // Public testimonial access
    const publicTestimonials = await getPublicTestimonials(5); // 5-star reviews only
    console.log('5-star testimonials:', publicTestimonials);
    
    // User testimonial management
    const myTestimonial = await getMyTestimonial(userToken);
    if (!myTestimonial) {
      // Create new testimonial
      const newTestimonial = await createTestimonial(userToken, {
        rating: 5,
        text: 'Excellent service! Very satisfied with the exchange process.',
      });
      console.log('New testimonial created:', newTestimonial);
    } else {
      // Update existing testimonial
      const updatedTestimonial = await updateTestimonial(userToken, myTestimonial.id, {
        rating: 4,
        text: 'Good service, room for improvement.',
      });
      console.log('Testimonial updated:', updatedTestimonial);
    }
    
    // Admin testimonial management
    if (await checkAdminAccess(adminToken)) {
      // Get pending testimonials
      const pendingTestimonials = await getPendingTestimonials(adminToken);
      console.log('Pending testimonials:', pendingTestimonials);
      
      // Approve testimonials
      for (const testimonial of pendingTestimonials.slice(0, 3)) {
        await approveTestimonial(adminToken, testimonial.id);
        console.log(`Approved testimonial: ${testimonial.id}`);
      }
      
      // Get testimonial statistics
      const testimonialStats = await getTestimonialStats(adminToken);
      console.log('Testimonial Stats:', testimonialStats);
      console.log(`Average Rating: ${testimonialStats.averageRating}`);
      console.log(`Rating Breakdown:`, testimonialStats.ratingBreakdown);
      
      // Bulk approve testimonials
      await bulkApproveTestimonials(adminToken, {
        ids: ['test-1', 'test-2', 'test-3'],
      });
      console.log('Bulk testimonial approval completed');
    }
    
  } catch (error) {
    console.error('Testimonial management error:', handleApiError(error));
  }
};

// =============================================================================
// EXAMPLE USAGE - SERVICE FEE MANAGEMENT
// =============================================================================

export const exampleServiceFeeManagement = async (adminToken: string) => {
  try {
    // Public service fee access
    const currentConfig = await getCurrentServiceFee();
    console.log('Current service fee:', formatPercentage(currentConfig.percentage));
    
    // Calculate service fee for amount
    const feeCalculation = await calculateServiceFee(1000);
    console.log('Fee calculation for $1000:');
    console.log(`Base: ${formatCurrency(feeCalculation.base_amount)}`);
    console.log(`Fee: ${formatCurrency(feeCalculation.service_fee)}`);
    console.log(`Total: ${formatCurrency(feeCalculation.total_amount)}`);
    
    // Calculate base amount from total
    const baseCalculation = await calculateBaseAmount(1025);
    console.log('Base calculation for $1025 total:');
    console.log(`Base: ${formatCurrency(baseCalculation.base_amount)}`);
    console.log(`Fee: ${formatCurrency(baseCalculation.service_fee)}`);
    
    // Admin service fee management
    if (await checkAdminAccess(adminToken)) {
      // Validate new service fee configuration
      const validation = await validateServiceFeeConfig(adminToken, {
        percentage: 2.5,
      });
      
      if (validation.valid) {
        // Set floating rate
        const newConfig = await setFloatingRate(adminToken, {
          percentage: 2.5,
        });
        console.log('New floating rate set:', formatPercentage(newConfig.percentage));
      } else {
        console.error('Invalid configuration:', validation.message);
      }
      
      // Get service fee statistics
      // const feeStats = await getServiceFeeStats(adminToken);
      // console.log('Service Fee Stats:');
      // console.log(`Total Fees Collected: ${formatCurrency(feeStats.totalFeesCollected)}`);
      // console.log(`Average Fee: ${formatPercentage(feeStats.averageFeePercentage)}`);
      // console.log(`Total Transactions: ${feeStats.totalTransactions}`);
      
      // Get service fee history
      const feeHistory = await getServiceFeeHistory(adminToken);
      console.log('Service Fee History:');
      feeHistory.forEach(entry => {
        console.log(`${formatDate(entry.created_at)}: ${formatPercentage(entry.percentage)} by ${entry.created_by}`);
      });
      
      // Reset to default configuration (if needed)
      // await resetServiceFeeConfig(adminToken);
      // console.log('Service fee configuration reset to default');
    }
    
  } catch (error) {
    console.error('Service fee management error:', handleApiError(error));
  }
};

// =============================================================================
// COMPLETE EXAMPLE WORKFLOW
// =============================================================================

export const completeExampleWorkflow = async () => {
  try {
    console.log('🚀 Starting complete example workflow...');
    
    // 1. User Registration and Authentication
    console.log('\n📝 User Registration and Authentication');
    const signupResponse = await userSignup({
      email: `user-${Date.now()}@example.com`,
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe',
      user_type: 'customer',
    });
    const userToken = signupResponse.token;
    
    // 2. Admin Login (assuming admin exists)
    console.log('\n👑 Admin Authentication');
    const adminLoginResponse = await userLogin({
      email: 'admin@blockhaven.com',
      password: 'admin123',
    });
    
    let adminToken: string;
    if (adminLoginResponse.requiresTwoFactor && adminLoginResponse.pendingToken) {
      // Handle 2FA for admin (simplified for example)
      const adminVerifyResponse = await verify2FA({
        email: 'admin@blockhaven.com',
        code: '123456', // Example code
        pendingToken: adminLoginResponse.pendingToken,
      });
      adminToken = adminVerifyResponse.data.token;
    } else if (adminLoginResponse.data) {
      adminToken = adminLoginResponse.data.token;
    } else {
      throw new Error('Invalid admin login response');
    }
    
    // 3. Public API Usage
    console.log('\n🌐 Public API Usage');
    const publicFAQs = await getPublicFAQs();
    const publicTestimonials = await getPublicTestimonials();
    const currentServiceFee = await getCurrentServiceFee();
    
    console.log(`Found ${publicFAQs.length} public FAQs`);
    console.log(`Found ${publicTestimonials.length} public testimonials`);
    console.log(`Current service fee: ${formatPercentage(currentServiceFee.percentage)}`);
    
    // 4. User Operations
    console.log('\n👤 User Operations');
    await createTestimonial(userToken, {
      rating: 5,
      text: 'Great platform! Easy to use and reliable.',
    });
    console.log('User testimonial created');
    
    // 5. Admin Operations
    console.log('\n⚙️ Admin Operations');
    if (await checkAdminAccess(adminToken)) {
      const newFAQ = await createFAQ(adminToken, {
        question: 'Is the platform secure?',
        answer: 'Yes, we use industry-standard security measures.',
        is_active: true,
      });
      console.log(`Created FAQ: ${newFAQ.id}`);
      
      const pendingTestimonials = await getPendingTestimonials(adminToken);
      if (pendingTestimonials.length > 0) {
        await approveTestimonial(adminToken, pendingTestimonials[0].id);
        console.log(`Approved testimonial: ${pendingTestimonials[0].id}`);
      }
      
      const stats = await getFAQStats(adminToken);
      console.log(`FAQ Stats - Total: ${stats.stats.total}, Active: ${stats.stats.active}`);
    }
    
    console.log('\n✅ Complete example workflow finished successfully!');
    
  } catch (error) {
    console.error('❌ Workflow error:', handleApiError(error));
  }
};

// Export all examples for easy usage
export const examples = {
  userAuthentication: exampleUserAuthentication,
  faqManagement: exampleFAQManagement,
  testimonialManagement: exampleTestimonialManagement,
  serviceFeeManagement: exampleServiceFeeManagement,
  completeWorkflow: completeExampleWorkflow,
};

// Usage:
// import { examples } from './api-examples';
// examples.completeWorkflow();