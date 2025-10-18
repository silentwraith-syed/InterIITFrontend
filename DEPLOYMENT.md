# Deployment Guide - KGPTalks Frontend

This guide covers containerization with Docker and deployment to cloud platforms.

---

## 🐳 Docker Containerization

### Dockerfile

Create `Dockerfile` in the project root:

```dockerfile
# Multi-stage build for optimized production image

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

Create `nginx.conf` in the project root:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (if backend is on same domain)
    location /api {
        proxy_pass http://backend:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### .dockerignore

Create `.dockerignore` to exclude unnecessary files:

```
node_modules
dist
.git
.gitignore
.env
.env.local
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
coverage
.vscode
.idea
README.md
REQUIREMENTS.md
```

### Docker Compose (Development)

Create `docker-compose.yml` for local development:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://backend:4000
    depends_on:
      - backend
    networks:
      - kgptalks-network

  backend:
    image: your-backend-image:latest  # Replace with actual backend image
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/kgptalks
    depends_on:
      - db
    networks:
      - kgptalks-network

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=kgptalks
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - kgptalks-network

networks:
  kgptalks-network:
    driver: bridge

volumes:
  postgres-data:
```

### Build and Run Docker

```bash
# Build the image
docker build -t kgptalks-frontend:latest .

# Run the container
docker run -p 3000:80 kgptalks-frontend:latest

# Or use docker-compose
docker-compose up -d

# View logs
docker-compose logs -f frontend

# Stop containers
docker-compose down
```

---

## ☁️ Deployment Options

### Option 1: Vercel (Recommended for Frontend)

#### Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)

#### Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/silentwraith-syed/InterIITFrontend.git
git push -u origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure build settings:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. **Environment Variables**
   Add in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-api.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically deploy on every push to main

#### Custom Domain
- Go to Project Settings → Domains
- Add your custom domain (e.g., `kgptalks.com`)
- Update DNS records as instructed

---

### Option 2: Netlify

#### Steps

1. **Create `netlify.toml`**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

2. **Deploy via Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

3. **Or Deploy via GitHub**
   - Connect repository in Netlify dashboard
   - Configure build settings (same as Vercel)
   - Add environment variables

---

### Option 3: Railway.app

#### Steps

1. **Create `railway.json`**
```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100
  }
}
```

2. **Deploy**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Link to project
railway link

# Deploy
railway up
```

3. **Environment Variables**
   Set in Railway dashboard or via CLI:
   ```bash
   railway variables set VITE_API_URL=https://your-api.railway.app
   ```

---

### Option 4: Render.com

#### Steps

1. **Create `render.yaml`**
```yaml
services:
  - type: web
    name: kgptalks-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
    envVars:
      - key: NODE_VERSION
        value: 18
      - key: VITE_API_URL
        value: https://your-backend.onrender.com
```

2. **Deploy**
   - Connect GitHub repository in Render dashboard
   - Render will auto-detect `render.yaml`
   - Click "Create Web Service"

---

### Option 5: Fly.io

#### Steps

1. **Install Fly CLI**
```bash
# macOS/Linux
curl -L https://fly.io/install.sh | sh

# Windows
pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

2. **Create `fly.toml`**
```toml
app = "kgptalks-frontend"
primary_region = "sin"  # Singapore (closest to India)

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "8080"

[http_service]
  internal_port = 80
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256
```

3. **Deploy**
```bash
# Login
fly auth login

# Launch app
fly launch

# Deploy
fly deploy

# Open in browser
fly open
```

---

### Option 6: Azure Static Web Apps (Free with Student Pack)

#### Prerequisites
- Azure account with Student Pack credits

#### Steps

1. **Create `staticwebapp.config.json`**
```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/images/*.{png,jpg,gif}", "/css/*"]
  },
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["authenticated"]
    }
  ],
  "responseOverrides": {
    "404": {
      "rewrite": "/index.html",
      "statusCode": 200
    }
  }
}
```

2. **Deploy via GitHub Actions**
   - Create Static Web App in Azure Portal
   - Connect to GitHub repository
   - Azure auto-creates GitHub Action workflow
   - Customize workflow if needed

3. **GitHub Action (auto-generated)**
```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    name: Build and Deploy
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: "dist"
```

---

## 🚀 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🔒 Environment Variables

### Required Variables

```bash
# API Backend URL
VITE_API_URL=https://api.kgptalks.com

# Optional: Enable analytics
VITE_ANALYTICS_ID=your-analytics-id

# Optional: Sentry error tracking
VITE_SENTRY_DSN=https://your-sentry-dsn
```

### Setting Variables

**Vercel:**
```bash
vercel env add VITE_API_URL production
```

**Netlify:**
```bash
netlify env:set VITE_API_URL https://api.kgptalks.com
```

**Railway:**
```bash
railway variables set VITE_API_URL=https://api.kgptalks.com
```

**Docker:**
```bash
docker run -e VITE_API_URL=https://api.kgptalks.com kgptalks-frontend
```

---

## 📊 Performance Optimization

### Build Optimizations

1. **Enable Code Splitting**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    }
  }
})
```

2. **Image Optimization**
   - Use WebP format
   - Implement lazy loading
   - Use CDN for images (Cloudinary, ImageKit)

3. **Bundle Analysis**
```bash
npm run build -- --mode analyze
```

### Deployment Best Practices

1. **Enable Compression** (gzip/brotli)
2. **Set up CDN** (Cloudflare, Fastly)
3. **Configure Caching Headers**
4. **Enable HTTP/2**
5. **Implement Service Worker** (PWA)

---

## 🔍 Monitoring & Analytics

### Recommended Tools

1. **Vercel Analytics** (built-in)
2. **Google Analytics 4**
3. **Sentry** (error tracking)
4. **LogRocket** (session replay)

### Integration Example (Sentry)

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

---

## ✅ Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Build succeeds locally
- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] Images optimized
- [ ] Meta tags updated (SEO)
- [ ] Error tracking configured
- [ ] Analytics integrated
- [ ] Performance metrics acceptable
- [ ] Mobile responsive verified
- [ ] Cross-browser tested
- [ ] Security headers configured
- [ ] HTTPS enabled
- [ ] Custom domain configured (if applicable)

---

## 🆘 Troubleshooting

### Common Issues

**Build fails on deployment:**
- Check Node.js version (use 18+)
- Verify all dependencies in package.json
- Check for TypeScript errors

**API calls fail:**
- Verify VITE_API_URL is set correctly
- Check CORS settings on backend
- Ensure backend is running

**Routing doesn't work:**
- Verify SPA redirect rules (nginx.conf, _redirects, etc.)
- Check router configuration

**Slow loading:**
- Enable compression
- Implement code splitting
- Use CDN for assets

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Railway Docs**: https://docs.railway.app
- **Fly.io Docs**: https://fly.io/docs
- **Azure Docs**: https://docs.microsoft.com/azure

---

**Last Updated**: October 18, 2025  
**Author**: Syed Mehran Ahmed
