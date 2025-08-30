# 🚀 Quick Deployment Reference

## Prerequisites Checklist
- [ ] Node.js 18+ installed
- [ ] Git installed and configured
- [ ] Vercel account created
- [ ] API keys ready (Google Custom Search, Google Cloud, OpenAI)

## Quick Deploy Options

### Option 1: Automated Script (Recommended)
```bash
# Windows (PowerShell)
.\deploy-vercel.ps1

# Windows (Command Prompt)
deploy-vercel.bat

# Linux/Mac
./deploy-vercel.sh
```

### Option 2: Manual Steps
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Build locally
npm run build

# 3. Deploy
vercel
```

### Option 3: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure environment variables
5. Deploy

## Environment Variables Required
```
GOOGLE_CUSTOM_SEARCH_API_KEY=your_key
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_engine_id
GOOGLE_CLOUD_API_KEY=your_cloud_key
OPENAI_API_KEY=your_openai_key (optional)
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Build fails | Run `npm run build` locally first |
| API calls fail | Check environment variables in Vercel dashboard |
| Images not loading | Verify domains in `next.config.js` |
| Git not initialized | Run `git init && git add . && git commit -m "Initial"` |

## Post-Deployment Checklist
- [ ] Test search functionality
- [ ] Test ABS API integration
- [ ] Test data ingestion features
- [ ] Test text-to-speech features
- [ ] Configure custom domain (optional)
- [ ] Set up analytics (optional)

## Support
- 📖 Full guide: `VERCEL_DEPLOYMENT_GUIDE.md`
- 🔧 Scripts: `deploy-vercel.*`
- 🌐 Vercel docs: [vercel.com/docs](https://vercel.com/docs)
