# DataLandscape Vercel Deployment Script for PowerShell
# This script helps automate the deployment process to Vercel

param(
    [switch]$SkipBuild,
    [switch]$SkipGit,
    [switch]$Force
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

Write-Host "🚀 DataLandscape Vercel Deployment Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "package.json") -or -not (Test-Path "next.config.js")) {
    Write-Error "This script must be run from the DataLandscape project root directory"
    exit 1
}

Write-Status "Checking prerequisites..."

# Check Node.js version
try {
    $nodeVersion = node --version
    Write-Success "Node.js version: $nodeVersion"
} catch {
    Write-Error "Node.js is not installed or not in PATH"
    exit 1
}

# Check if Git is installed
try {
    $gitVersion = git --version
    Write-Success "Git is installed: $gitVersion"
} catch {
    Write-Error "Git is not installed. Please install Git first."
    exit 1
}

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Success "Vercel CLI is installed: $vercelVersion"
} catch {
    Write-Warning "Vercel CLI is not installed. Installing now..."
    try {
        npm install -g vercel
        Write-Success "Vercel CLI installed"
    } catch {
        Write-Error "Failed to install Vercel CLI. Please install manually: npm install -g vercel"
        exit 1
    }
}

if (-not $SkipBuild) {
    Write-Status "Installing dependencies..."
    try {
        npm install
        Write-Success "Dependencies installed"
    } catch {
        Write-Error "Failed to install dependencies"
        exit 1
    }

    Write-Status "Building project locally..."
    try {
        npm run build
        Write-Success "Local build successful"
    } catch {
        Write-Error "Local build failed. Please fix the issues before deploying."
        exit 1
    }
} else {
    Write-Warning "Skipping build process"
}

Write-Status "Checking environment variables..."
if (-not (Test-Path ".env.local")) {
    Write-Warning "No .env.local file found. Creating template..."
    @"
# Google Custom Search API Configuration
GOOGLE_CUSTOM_SEARCH_API_KEY=your_google_custom_search_api_key_here
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_search_engine_id_here

# Google Cloud Text-to-Speech API Configuration
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here

# OpenAI API Configuration (Optional)
OPENAI_API_KEY=your_openai_api_key_here
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Warning "Please update .env.local with your actual API keys before deploying"
} else {
    Write-Success ".env.local file found"
}

if (-not $SkipGit) {
    Write-Status "Checking Git status..."
    if (Test-Path ".git") {
        $gitStatus = git status --porcelain
        if ($gitStatus) {
            Write-Warning "You have uncommitted changes. Consider committing them before deployment."
            if (-not $Force) {
                $commitChanges = Read-Host "Do you want to commit changes now? (y/n)"
                if ($commitChanges -eq "y" -or $commitChanges -eq "Y") {
                    try {
                        git add .
                        git commit -m "Deploy to Vercel - $(Get-Date)"
                        Write-Success "Changes committed"
                    } catch {
                        Write-Error "Failed to commit changes"
                        exit 1
                    }
                }
            }
        } else {
            Write-Success "No uncommitted changes"
        }
    } else {
        Write-Warning "Git repository not initialized. Initializing now..."
        try {
            git init
            git add .
            git commit -m "Initial commit for Vercel deployment"
            Write-Success "Git repository initialized"
        } catch {
            Write-Error "Failed to initialize Git repository"
            exit 1
        }
    }
} else {
    Write-Warning "Skipping Git operations"
}

Write-Status "Starting Vercel deployment..."
Write-Host ""
Write-Warning "The Vercel CLI will now guide you through the deployment process."
Write-Warning "Make sure you have your API keys ready for environment variables."
Write-Host ""

# Deploy to Vercel
try {
    vercel
    Write-Success "Deployment process completed!"
} catch {
    Write-Error "Deployment failed. Please check the error messages above."
    exit 1
}

Write-Host ""
Write-Status "Next steps:"
Write-Host "1. Check your deployment URL in the Vercel dashboard"
Write-Host "2. Test all functionality on the live site"
Write-Host "3. Configure environment variables in Vercel dashboard if needed"
Write-Host "4. Set up custom domain if desired"
Write-Host ""
Write-Status "For detailed instructions, see VERCEL_DEPLOYMENT_GUIDE.md"
