#!/bin/bash

# DataLandscape Vercel Deployment Script
# This script helps automate the deployment process to Vercel

set -e  # Exit on any error

echo "🚀 DataLandscape Vercel Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "next.config.js" ]; then
    print_error "This script must be run from the DataLandscape project root directory"
    exit 1
fi

print_status "Checking prerequisites..."

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi
print_success "Node.js version: $(node --version)"

# Check if Git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi
print_success "Git is installed"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI is not installed. Installing now..."
    npm install -g vercel
    print_success "Vercel CLI installed"
else
    print_success "Vercel CLI is installed"
fi

print_status "Installing dependencies..."
npm install

print_status "Building project locally..."
if npm run build; then
    print_success "Local build successful"
else
    print_error "Local build failed. Please fix the issues before deploying."
    exit 1
fi

print_status "Checking environment variables..."
if [ ! -f ".env.local" ]; then
    print_warning "No .env.local file found. Creating template..."
    cat > .env.local << EOF
# Google Custom Search API Configuration
GOOGLE_CUSTOM_SEARCH_API_KEY=your_google_custom_search_api_key_here
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_search_engine_id_here

# Google Cloud Text-to-Speech API Configuration
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here

# OpenAI API Configuration (Optional)
OPENAI_API_KEY=your_openai_api_key_here
EOF
    print_warning "Please update .env.local with your actual API keys before deploying"
else
    print_success ".env.local file found"
fi

print_status "Checking Git status..."
if [ -d ".git" ]; then
    if git status --porcelain | grep -q .; then
        print_warning "You have uncommitted changes. Consider committing them before deployment."
        read -p "Do you want to commit changes now? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git add .
            git commit -m "Deploy to Vercel - $(date)"
            print_success "Changes committed"
        fi
    else
        print_success "No uncommitted changes"
    fi
else
    print_warning "Git repository not initialized. Initializing now..."
    git init
    git add .
    git commit -m "Initial commit for Vercel deployment"
    print_success "Git repository initialized"
fi

print_status "Starting Vercel deployment..."
echo
print_warning "The Vercel CLI will now guide you through the deployment process."
print_warning "Make sure you have your API keys ready for environment variables."
echo

# Deploy to Vercel
vercel

print_success "Deployment process completed!"
echo
print_status "Next steps:"
echo "1. Check your deployment URL in the Vercel dashboard"
echo "2. Test all functionality on the live site"
echo "3. Configure environment variables in Vercel dashboard if needed"
echo "4. Set up custom domain if desired"
echo
print_status "For detailed instructions, see VERCEL_DEPLOYMENT_GUIDE.md"
