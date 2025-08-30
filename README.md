# DataLandscape - Unified Search Platform

A powerful search platform that combines web search with official Australian Bureau of Statistics (ABS) data, providing a unified interface for discovering both trusted web content and authoritative government statistics.

## 🚀 Features

### **Unified Search Interface**
- **Single Search Bar**: Search across web content and ABS statistics with one interface
- **Smart Toggle**: Switch between Web Search and ABS Statistics modes
- **Popular ABS Dataflows**: Quick access to common statistics like CPI, Population, Labour Force
- **Advanced Options**: Custom data keys, time periods, and filtering

### **Web Search Capabilities**
- **Trusted Sources**: Government, academic, and technical websites
- **Rich Results**: Articles, documentation, research papers, and reports
- **Content Analysis**: AI-powered summarization and key point extraction
- **Dataset Discovery**: Find and analyze data assets from web sources

### **ABS Statistics Integration**
- **Official Data**: Direct access to Australian Bureau of Statistics
- **Popular Dataflows**: CPI, Population, Labour Force, Housing, Education, Health
- **Real-time Data**: Latest official statistics and historical trends
- **Structured Results**: Clean, organized presentation of statistical data

### **AI-Powered Analysis**
- **Multi-Provider Support**: OpenAI and Google Gemini AI integration
- **Content Summarization**: Automatic extraction of key insights
- **Sentiment Analysis**: Understand the tone and context of content
- **Confidence Scoring**: Reliability indicators for analysis results

## 🛠 Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Search APIs**: Google Custom Search API, ABS Data API
- **AI Services**: OpenAI GPT-3.5, Google Gemini Pro
- **Text-to-Speech**: Google Cloud Text-to-Speech API
- **Styling**: Tailwind CSS, Lucide React Icons

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KaelRoyale/GovHack-DataNavigator.git
   cd datalandscape-search
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp env.template .env.local
   ```
   
   Edit `.env.local` with your API keys:
   ```env
   # Google Custom Search API
   GOOGLE_CUSTOM_SEARCH_API_KEY=your_google_custom_search_api_key
   GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_search_engine_id
   
   # Google Cloud API (Text-to-Speech + Gemini AI)
   GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key
   
   # OpenAI API (Optional - for AI analysis)
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🔧 API Configuration

### **Google Custom Search API**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Custom Search API
3. Create credentials (API Key)
4. Create a Custom Search Engine at [Google Programmable Search Engine](https://programmablesearchengine.google.com/)
5. Add your API key and Search Engine ID to `.env.local`

### **ABS Data API**
- No API key required - uses public ABS SDMX RESTful web service
- Access official Australian Bureau of Statistics data
- Supports dataflow discovery and data retrieval

### **AI Services**
- **OpenAI**: Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Google Gemini**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🎯 Usage

### **Web Search**
1. Select "Web Search" mode
2. Enter your search query
3. Browse results from trusted sources
4. Use "Fetch Dataset Info" to analyze content
5. Click "Analyze with AI" for intelligent insights

### **ABS Statistics**
1. Select "ABS Statistics" mode
2. Choose from popular dataflows or enter custom ID
3. Use advanced options for specific data keys and time periods
4. View official statistics and trends
5. Access detailed metadata and documentation

### **Unified Experience**
- Search in one mode, get results from both sources
- Switch between tabs to explore different result types
- Combine web research with official statistics
- Use AI analysis on any content

## 📊 Available ABS Dataflows

| Dataflow ID | Name | Description |
|-------------|------|-------------|
| `CPI` | Consumer Price Index | Inflation and price statistics |
| `POP` | Population Estimates | Demographic statistics |
| `LFS` | Labour Force Survey | Employment statistics |
| `ALC` | Alcohol Consumption | Health statistics |
| `RES_DWELL` | Residential Dwellings | Housing statistics |
| `EDU` | Education Statistics | Educational data |

## 🔍 API Endpoints

### **Search APIs**
- `POST /api/search` - Web search using Google Custom Search
- `POST /api/abs-search` - ABS statistics search
- `POST /api/fetch-dataset-info` - Extract dataset information from webpages

### **AI Analysis**
- `POST /api/analyze-article` - AI-powered content analysis
- `GET /api/test-openai` - Test OpenAI API connection
- `GET /api/test-gemini` - Test Gemini API connection

### **Text-to-Speech**
- `POST /api/text-to-speech` - Convert text to speech

## 🎨 Components

### **Core Components**
- `UnifiedSearch` - Main search interface with mode toggle
- `UnifiedResults` - Tabbed results display for web and ABS data
- `SearchResultCard` - Individual result display with analysis options
- `Pagination` - Navigation for large result sets

### **Specialized Components**
- `ABSSearch` - ABS-specific search interface (legacy)
- `SearchBar` - Simple web search bar (legacy)
- `TextToSpeech` - Audio playback functionality

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### **Other Platforms**
- **Netlify**: Configure build settings and environment variables
- **Railway**: Add environment variables and deploy
- **Docker**: Use provided Dockerfile for containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Australian Bureau of Statistics** for providing the public data API
- **Google** for Custom Search and AI services
- **OpenAI** for GPT-3.5 integration
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first styling

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/KaelRoyale/GovHack-DataNavigator/issues)
- **Documentation**: [Wiki](https://github.com/KaelRoyale/GovHack-DataNavigator/wiki)
- **Demo**: [Live Demo](https://datalandscape-search.vercel.app)

---

**Built with ❤️ for the Australian data community**
