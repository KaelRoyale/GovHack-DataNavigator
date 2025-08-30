@echo off
setlocal enabledelayedexpansion

REM DataLandscape Vercel Deployment Script for Windows
REM This script helps automate the deployment process to Vercel

echo 🚀 DataLandscape Vercel Deployment Script
echo ==========================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] This script must be run from the DataLandscape project root directory
    exit /b 1
)
if not exist "next.config.js" (
    echo [ERROR] This script must be run from the DataLandscape project root directory
    exit /b 1
)

echo [INFO] Checking prerequisites...

REM Check Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [SUCCESS] Node.js version: %NODE_VERSION%

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git is not installed. Please install Git first.
    exit /b 1
)
echo [SUCCESS] Git is installed

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Vercel CLI is not installed. Installing now...
    npm install -g vercel
    echo [SUCCESS] Vercel CLI installed
) else (
    echo [SUCCESS] Vercel CLI is installed
)

echo [INFO] Installing dependencies...
npm install

echo [INFO] Building project locally...
npm run build
if errorlevel 1 (
    echo [ERROR] Local build failed. Please fix the issues before deploying.
    exit /b 1
)
echo [SUCCESS] Local build successful

echo [INFO] Checking environment variables...
if not exist ".env.local" (
    echo [WARNING] No .env.local file found. Creating template...
    (
        echo # Google Custom Search API Configuration
        echo GOOGLE_CUSTOM_SEARCH_API_KEY=your_google_custom_search_api_key_here
        echo GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_search_engine_id_here
        echo.
        echo # Google Cloud Text-to-Speech API Configuration
        echo GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here
        echo.
        echo # OpenAI API Configuration ^(Optional^)
        echo OPENAI_API_KEY=your_openai_api_key_here
    ) > .env.local
    echo [WARNING] Please update .env.local with your actual API keys before deploying
) else (
    echo [SUCCESS] .env.local file found
)

echo [INFO] Checking Git status...
if exist ".git" (
    git status --porcelain >nul 2>&1
    if not errorlevel 1 (
        echo [WARNING] You have uncommitted changes. Consider committing them before deployment.
        set /p COMMIT_CHANGES="Do you want to commit changes now? (y/n): "
        if /i "!COMMIT_CHANGES!"=="y" (
            git add .
            git commit -m "Deploy to Vercel - %date% %time%"
            echo [SUCCESS] Changes committed
        )
    ) else (
        echo [SUCCESS] No uncommitted changes
    )
) else (
    echo [WARNING] Git repository not initialized. Initializing now...
    git init
    git add .
    git commit -m "Initial commit for Vercel deployment"
    echo [SUCCESS] Git repository initialized
)

echo [INFO] Starting Vercel deployment...
echo.
echo [WARNING] The Vercel CLI will now guide you through the deployment process.
echo [WARNING] Make sure you have your API keys ready for environment variables.
echo.

REM Deploy to Vercel
vercel

echo [SUCCESS] Deployment process completed!
echo.
echo [INFO] Next steps:
echo 1. Check your deployment URL in the Vercel dashboard
echo 2. Test all functionality on the live site
echo 3. Configure environment variables in Vercel dashboard if needed
echo 4. Set up custom domain if desired
echo.
echo [INFO] For detailed instructions, see VERCEL_DEPLOYMENT_GUIDE.md

pause
