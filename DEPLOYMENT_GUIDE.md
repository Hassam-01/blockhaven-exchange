# Production Deployment Guide

## Pre-deployment Checklist

### ✅ Code Cleanup Completed
- [x] Removed all "lovable" references
- [x] Fixed TypeScript errors
- [x] Updated README.md
- [x] Successful production build

### 🔧 Environment Setup
1. Create `.env` file with production values:
```bash
VITE_API_BASE_URL=https://your-api-domain.com
```

2. Verify all environment variables are properly prefixed with `VITE_`

### 🏗️ Build Process
```bash
# Install dependencies
npm install

# Run production build
npm run build

# Preview production build locally (optional)
npm run preview
```

### 🚀 Deployment Options

#### Option 1: Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Option 2: Netlify
1. Connect repository or drag `dist` folder
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

#### Option 3: AWS S3 + CloudFront
1. Upload `dist` folder contents to S3 bucket
2. Configure bucket for static website hosting
3. Set up CloudFront distribution
4. Configure custom domain (optional)

#### Option 4: Docker
```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 🔒 Security Headers
Add these headers to your web server configuration:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
```

### 📊 Post-deployment Verification
- [ ] Test all main user flows
- [ ] Verify API connectivity
- [ ] Check cryptocurrency exchange functionality
- [ ] Test responsive design on various devices
- [ ] Verify SSL certificate
- [ ] Test error handling

### 🔧 Monitoring Setup
Consider setting up:
- Error tracking (Sentry)
- Performance monitoring (Web Vitals)
- Uptime monitoring
- Analytics (if required)

## Important Notes

1. **API Keys**: Never commit real API keys to version control
2. **CORS**: Ensure your backend API allows requests from your production domain
3. **HTTPS**: Always use HTTPS in production for security
4. **Database**: Ensure your backend database is production-ready
5. **Rate Limiting**: Implement rate limiting on both frontend and backend