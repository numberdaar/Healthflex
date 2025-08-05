# 🚀 Vercel Deployment Guide

## Quick Deploy

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Option 2: GitHub Integration

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect in Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

## Configuration Files

### vercel.json
```json
{
  "buildCommand": "npx expo export --platform web",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### package.json Scripts
```json
{
  "scripts": {
    "build": "expo export --platform web",
    "export": "expo export --platform web"
  }
}
```

## Troubleshooting

### 404 Error
- ✅ Check that `vercel.json` exists in root
- ✅ Verify `build` script in `package.json`
- ✅ Test build locally: `npm run build`

### Build Fails
- ✅ Check Vercel build logs
- ✅ Ensure all dependencies are installed
- ✅ Test local build first

### App Doesn't Load
- ✅ Check browser console for errors
- ✅ Verify static files are served
- ✅ Test exported build locally

## Local Testing

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Serve the build**:
   ```bash
   npx serve dist
   ```

3. **Test in browser**:
   - Open `http://localhost:3000`
   - Verify all features work

## Environment Variables

If you need environment variables:

1. **Add to Vercel Dashboard**:
   - Go to Project Settings → Environment Variables
   - Add any required variables

2. **Or use .env file**:
   ```bash
   # .env.local
   EXPO_PUBLIC_API_URL=your-api-url
   ```

## Custom Domain

1. **Add domain in Vercel**:
   - Go to Project Settings → Domains
   - Add your custom domain

2. **Update DNS**:
   - Point your domain to Vercel's nameservers
   - Or add CNAME record

## Performance Tips

- ✅ Enable Vercel's Edge Network
- ✅ Use static generation where possible
- ✅ Optimize images and assets
- ✅ Enable compression

## Support

If you encounter issues:
1. Check Vercel build logs
2. Test locally first
3. Review this guide
4. Check Vercel documentation 