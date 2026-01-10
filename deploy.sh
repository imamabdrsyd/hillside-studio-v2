#!/bin/bash

# Hillside Studio v2 - Vercel Deployment Script
# This script helps you deploy to Vercel with proper environment variables

echo "🚀 Hillside Studio v2 - Vercel Deployment"
echo "=========================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel@latest
fi

echo "✅ Vercel CLI is ready"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found!"
    echo "Creating from example..."
    cp .env.local.example .env.local
    echo ""
    echo "📝 Please edit .env.local and add your Supabase credentials:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo ""
    echo "Press Enter when ready..."
    read
fi

# Load environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

echo "🔍 Checking environment variables..."
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ "$NEXT_PUBLIC_SUPABASE_URL" = "https://your-project.supabase.co" ]; then
    echo ""
    echo "⚠️  WARNING: Supabase URL not configured!"
    echo "Please update .env.local with your actual Supabase credentials"
    echo ""
    echo "Get your credentials from:"
    echo "https://app.supabase.com/project/_/settings/api"
    echo ""
    exit 1
fi

echo "✅ Environment variables configured"
echo ""

# Run build to verify everything works
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""

# Deploy to Vercel
echo "🚀 Starting Vercel deployment..."
echo ""
echo "You will be asked to:"
echo "1. Login to Vercel (if not already logged in)"
echo "2. Link to existing project or create new one"
echo "3. Set up environment variables"
echo ""
echo "Press Enter to continue..."
read

# Deploy
vercel --prod

echo ""
echo "✨ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Visit your Vercel dashboard to see the deployment"
echo "2. Add environment variables in Vercel if not done automatically:"
echo "   - NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-key]"
echo "3. Test your application"
echo ""
