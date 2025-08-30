# DataLandscape Search Engine

A modern search engine website that utilizes Google Custom Search API to search across multiple websites and return available articles. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔍 **Multi-site Search**: Search across multiple websites simultaneously
- 📱 **Responsive Design**: Mobile-first design with beautiful UI
- ⚡ **Fast Performance**: Built with Next.js for optimal performance
- 🎨 **Modern UI**: Clean, Google-inspired interface
- 📊 **Rich Results**: Display article metadata, images, and publication dates
- 🔗 **Direct Links**: Open articles in new tabs

## Supported Websites

The search engine is configured to search across these popular websites:

- Medium.com
- Dev.to
- Hashnode.dev
- TechCrunch.com
- TheVerge.com
- ArsTechnica.com
- GitHub.com
- StackOverflow.com

You can easily modify the list of websites in the API configuration.

## Prerequisites

Before running this application, you need:

1. **Google Custom Search API Key**: Get from [Google Cloud Console](https://console.cloud.google.com/)
2. **Google Custom Search Engine ID**: Create at [Google Programmable Search Engine](https://programmablesearchengine.google.com/)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and configure your API credentials:

```bash
cp env.example .env.local
```

Edit `.env.local` and add your Google API credentials:

```env
GOOGLE_CUSTOM_SEARCH_API_KEY=your_actual_api_key_here
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_actual_search_engine_id_here
```

### 3. Get Google API Credentials

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Custom Search API" from the API Library

#### Step 2: Create API Key
1. Go to "Credentials" in the Google Cloud Console
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key

#### Step 3: Create Custom Search Engine
1. Go to [Google Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Click "Create a search engine"
3. Enter any website URL (you'll configure sites later)
4. Get your Search Engine ID from the control panel

#### Step 4: Configure Search Sites
1. In your Custom Search Engine control panel
2. Go to "Sites to search"
3. Add the websites you want to search (or leave empty for web search)
4. The API will handle site restrictions programmatically

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Search**: Enter keywords in the search bar
2. **Results**: View articles from multiple websites
3. **Click**: Open articles in new tabs
4. **Explore**: Browse article metadata and images

## Customization

### Adding More Websites

Edit the `searchSites` array in `app/api/search/route.ts`:

```typescript
const searchSites = [
  'site:medium.com',
  'site:dev.to',
  'site:your-website.com', // Add your preferred sites
  // ... more sites
]
```

### Styling

The application uses Tailwind CSS. You can customize:
- Colors in `tailwind.config.js`
- Components in `app/globals.css`
- Individual components in the `components/` directory

### API Configuration

Modify search parameters in `app/api/search/route.ts`:
- `num`: Number of results (max 10 for free tier)
- `searchType`: Type of search
- `fields`: Response fields to include

## API Limits

- **Free Tier**: 100 searches per day
- **Paid Tier**: $5 per 1000 searches
- **Results per query**: Maximum 10 results

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Technologies Used

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: Google Custom Search API
- **Deployment**: Vercel (recommended)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Support

If you encounter any issues:

1. Check that your API credentials are correct
2. Verify your Google Custom Search Engine is configured
3. Check the browser console for errors
4. Ensure you haven't exceeded API limits

## Roadmap

- [ ] Add search filters (date, site, type)
- [ ] Implement search suggestions
- [ ] Add result pagination
- [ ] Create search history
- [ ] Add bookmark functionality
- [ ] Implement advanced search operators
