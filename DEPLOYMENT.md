# Deployment Guide

This document explains how to deploy the Family Management App for production use.

## Production Build

To create a production build of the application, run:

```bash
npm run build
```

This will generate optimized static files in the `dist` directory that can be deployed to any static hosting service.

## Free Deployment Options

### 1. Vercel (Recommended)

Vercel is the best option for deploying React applications with zero configuration:

1. Sign up at [vercel.com](https://vercel.com)
2. Install the Vercel CLI: `npm install -g vercel`
3. Run `vercel` in your project directory
4. Follow the prompts to deploy

**Benefits:**
- Zero configuration deployment
- Automatic SSL certificates
- Global CDN
- Automatic scaling
- Continuous deployment from Git
- Free tier with generous limits

### 2. Netlify

Netlify is another excellent option for static site hosting:

1. Sign up at [netlify.com](https://netlify.com)
2. Connect your Git repository or drag and drop the `dist` folder
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

**Benefits:**
- Free SSL certificates
- Global CDN
- Continuous deployment
- Form handling
- Serverless functions (paid tier)

### 3. GitHub Pages

GitHub Pages is a simple option for hosting static sites:

1. Build the project: `npm run build`
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Add deployment scripts to `package.json`:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```
4. Deploy with: `npm run deploy`

### 4. Firebase Hosting

Firebase Hosting offers fast and secure hosting:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase login`
3. Run `firebase init hosting` in your project directory
4. Build your project: `npm run build`
5. Deploy with: `firebase deploy`

## Supabase Backend

The application uses Supabase as its backend, which has a generous free tier:

1. The project already includes all necessary database migrations
2. Deploy the migrations to your Supabase project:
   ```bash
   supabase db push
   ```
3. Or manually run the SQL files in the Supabase SQL Editor

## Environment Variables

Ensure the following environment variables are set in your production environment:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These can be configured in your deployment platform's settings.

## Performance Optimizations

The project includes several optimizations for production:

1. Code splitting with React.lazy and Suspense
2. Image optimization (when implemented)
3. Bundle size optimization with Vite
4. Tree shaking for unused code
5. Compression and minification

## Monitoring and Analytics

Consider adding monitoring to your production deployment:

1. Error tracking with Sentry
2. Performance monitoring with Google Analytics or similar
3. Uptime monitoring with services like UptimeRobot

## CI/CD Recommendations

For automated deployments:

1. Set up GitHub Actions to automatically deploy on pushes to main branch
2. Add testing to your pipeline
3. Use environment branches (development, staging, production)

## Troubleshooting

Common deployment issues:

1. **Environment variables not loaded**: Ensure they are properly configured in your hosting platform
2. **Routing issues**: Configure your host to redirect all routes to index.html for SPA
3. **API connection failures**: Verify Supabase credentials and network connectivity

## Best Practices for Production

1. Always use HTTPS
2. Set proper cache headers for static assets
3. Enable compression (gzip/brotli)
4. Monitor error rates and performance
5. Regularly update dependencies
6. Backup your database regularly