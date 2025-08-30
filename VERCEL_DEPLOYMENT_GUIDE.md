# Vercel Deployment Guide for DataLandscape

This guide provides step-by-step instructions to deploy your DataLandscape project to Vercel.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Git](https://git-scm.com/) installed and configured
- A [Vercel account](https://vercel.com/signup)
- Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Project

### 1.1 Verify Project Structure
Ensure your project has the following essential files:
```
DataLandscape/
├── app/
├── components/
├── lib/
├── public/
├── types/
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── .gitignore
```

### 1.2 Update Next.js Configuration
Your `next.config.js` looks good, but let's ensure it's optimized for Vercel:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['www.google.com', 'abs.gov.au'],
    unoptimized: false,
  },
  // Add Vercel-specific optimizations
  swcMinify: true,
  compress: true,
}

module.exports = nextConfig
```

### 1.3 Create Environment Variables File
Create a `.env.local` file in your project root (this will be used for local development):

```bash
# Google Custom Search API Configuration
GOOGLE_CUSTOM_SEARCH_API_KEY=your_google_custom_search_api_key_here
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_search_engine_id_here

# Google Cloud Text-to-Speech API Configuration
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here

# OpenAI API Configuration (Optional)
OPENAI_API_KEY=your_openai_api_key_here
```

## Step 2: Prepare Your Git Repository

### 2.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit for Vercel deployment"
```

### 2.2 Push to GitHub/GitLab/Bitbucket
```bash
# Create a new repository on GitHub/GitLab/Bitbucket
# Then push your code:
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your account

2. **Import Your Project**
   - Click "New Project"
   - Connect your Git provider (GitHub, GitLab, or Bitbucket)
   - Select your DataLandscape repository

3. **Configure Project Settings**
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `.next` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)

4. **Environment Variables**
   - Click "Environment Variables" section
   - Add each environment variable from your `.env.local`:
     ```
     GOOGLE_CUSTOM_SEARCH_API_KEY=your_actual_api_key
     GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_actual_engine_id
     GOOGLE_CLOUD_API_KEY=your_actual_cloud_key
     OPENAI_API_KEY=your_actual_openai_key
     ```
   - Set them for "Production", "Preview", and "Development" environments

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-5 minutes)

### 3.2 Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Project Directory**
   ```bash
   cd /path/to/your/DataLandscape
   vercel
   ```

4. **Follow the CLI Prompts**
   - Link to existing project or create new
   - Confirm project settings
   - Set environment variables when prompted

## Step 4: Post-Deployment Configuration

### 4.1 Verify Deployment
- Check your deployment URL (provided by Vercel)
- Test all major functionality:
  - Search functionality
  - ABS API integration
  - Data ingestion features
  - Text-to-speech features

### 4.2 Configure Custom Domain (Optional)
1. Go to your project dashboard in Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS settings as instructed

### 4.3 Set Up Environment Variables for Different Environments
In Vercel dashboard:
1. Go to "Settings" → "Environment Variables"
2. Configure variables for:
   - **Production**: Live site
   - **Preview**: Pull request deployments
   - **Development**: Local development

## Step 5: Troubleshooting Common Issues

### 5.1 Build Failures
**Issue**: Build fails during deployment
**Solutions**:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation passes locally:
  ```bash
  npm run build
  ```

### 5.2 Environment Variables Not Working
**Issue**: API calls fail in production
**Solutions**:
- Verify environment variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Redeploy after adding environment variables

### 5.3 API Rate Limiting
**Issue**: External API calls fail
**Solutions**:
- Implement proper error handling in your API routes
- Add retry logic for failed requests
- Consider using Vercel's Edge Functions for better performance

### 5.4 Image Optimization Issues
**Issue**: Images not loading or optimized
**Solutions**:
- Update `next.config.js` with correct image domains
- Use Next.js Image component properly
- Consider using Vercel's Image Optimization

## Step 6: Performance Optimization

### 6.1 Enable Vercel Analytics
1. Go to project dashboard
2. Click "Analytics" tab
3. Enable Web Analytics for performance monitoring

### 6.2 Configure Edge Functions (Optional)
For better performance, consider moving API routes to Edge Functions:
```javascript
// In your API route files, add:
export const runtime = 'edge'
```

### 6.3 Optimize Bundle Size
```bash
# Analyze bundle size
npm run build
# Check the build output for large dependencies
```

## Step 7: Continuous Deployment

### 7.1 Automatic Deployments
- Vercel automatically deploys on every push to main branch
- Pull requests create preview deployments
- Configure branch protection rules in your Git provider

### 7.2 Deployment Previews
- Each pull request gets a unique preview URL
- Test changes before merging to main
- Share preview URLs with team members

## Step 8: Monitoring and Maintenance

### 8.1 Monitor Performance
- Use Vercel Analytics
- Monitor Core Web Vitals
- Check error logs in Vercel dashboard

### 8.2 Regular Updates
- Keep dependencies updated
- Monitor for security vulnerabilities
- Update environment variables as needed

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_CUSTOM_SEARCH_API_KEY` | Google Custom Search API key | Yes |
| `GOOGLE_CUSTOM_SEARCH_ENGINE_ID` | Google Custom Search Engine ID | Yes |
| `GOOGLE_CLOUD_API_KEY` | Google Cloud API key for TTS | Yes |
| `OPENAI_API_KEY` | OpenAI API key for content analysis | No |

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

## Quick Deployment Checklist

- [ ] Project builds successfully locally (`npm run build`)
- [ ] All environment variables configured
- [ ] Git repository is up to date
- [ ] Vercel project created and configured
- [ ] Environment variables added to Vercel
- [ ] Initial deployment successful
- [ ] All functionality tested on live site
- [ ] Custom domain configured (if needed)
- [ ] Analytics enabled (optional)
- [ ] Team members have access (if applicable)

Your DataLandscape project should now be successfully deployed on Vercel! 🚀
