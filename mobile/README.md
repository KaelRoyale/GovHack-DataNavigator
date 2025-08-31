# 🔍 Expo Google Search App

A demo app built with **Expo (React Native)** that lets users search via **Google Custom Search API** and display results in a scrollable list (with infinite scroll pagination).

---

## 🚀 Features

- Search Google using Custom Search API.
- Display search results with:
  - Page title
  - Website link
  - Short description
  - Thumbnail image (if available)
- Infinite scroll – load more results when scrolling down.
- Loading and empty states with a custom PNG icon from `assets/images`.

---

## ⚙️ Setup
1. **Clone the repository and open this folder**
```bash
   git clone https://github.com/KaelRoyale/GovHack-DataNavigator.git
   cd datalandscape-search/mobile
```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Edit `.env` with your API keys:
```env
   # Google Custom Search API
   EXPO_PUBLIC_GOOGLE_API_KEY=your_google_custom_search_api_key
   EXPO_PUBLIC_GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id
```

4. **Run the app**
   ```bash
   npx expo start
   ```
