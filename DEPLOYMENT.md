# .env.example
# Kopiuj do .env i uzupełnij swoimi wartościami

# ============================================
# DEVELOPMENT
# ============================================
POCKETBASE_URL=http://localhost:8090
NODE_ENV=development
DEBUG=true

# ============================================
# PRODUCTION
# ============================================
# POCKETBASE_URL=https://api.your-domain.com
# NODE_ENV=production
# DEBUG=false

# ============================================
# FRONTEND
# ============================================
VITE_API_URL=http://localhost:8090
VITE_APP_NAME=PostHub
VITE_THEME=dark

# ============================================
# DATABASE (PocketBase defaults)
# ============================================
POCKETBASE_PORT=8090
POCKETBASE_DATA_DIR=./pb_data

# ============================================
# SECURITY
# ============================================
JWT_SECRET=your-super-secret-key-here
CORS_ORIGIN=http://localhost:3000,http://localhost:8000

# ============================================
# EMAIL (Optional - dla notifications)
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# ============================================
# STORAGE (Optional - dla image uploads)
# ============================================
S3_BUCKET=posthub-files
S3_REGION=eu-central-1
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key

# ============================================
# MONITORING
# ============================================
SENTRY_DSN=your-sentry-dsn
ANALYTICS_ID=your-analytics-id

---

# 📋 PRODUCTION DEPLOYMENT CHECKLIST

## Pre-Deployment
- [ ] Test aplikacji na dev
- [ ] Review code
- [ ] Update SETUP.md z instrukcjami
- [ ] Backup bazy danych
- [ ] Przygotuj SSL certificates
- [ ] Configure DNS records

## Infrastructure Setup
- [ ] Provision server (VPS, AWS, Railway, etc.)
- [ ] Install Docker & Docker Compose
- [ ] Configure firewall (allow 80, 443, block 8090)
- [ ] Setup SSL certificates (Let's Encrypt)
- [ ] Configure CDN (CloudFlare, AWS CloudFront)
- [ ] Setup monitoring & logging (Sentry, DataDog)

## Database & Backend
- [ ] Setup PocketBase collections
- [ ] Configure API Rules (security)
- [ ] Enable CORS (specific domains only)
- [ ] Setup backups (automated)
- [ ] Configure email notifications
- [ ] Test authentication flow

## Frontend Deployment
- [ ] Minify & optimize assets
- [ ] Update PB_URL constant
- [ ] Setup analytics
- [ ] Test all features
- [ ] Test responsive design
- [ ] Test on multiple browsers

## Security Hardening
- [ ] Enable HTTPS (redirect HTTP)
- [ ] Set security headers:
  - Content-Security-Policy
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Strict-Transport-Security
- [ ] Rate limiting on API
- [ ] CSRF protection
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] Remove debug logs

## Performance Optimization
- [ ] Enable gzip compression
- [ ] Setup caching (static files)
- [ ] Optimize images
- [ ] Lazy load components
- [ ] Setup CDN for static assets
- [ ] Monitor Core Web Vitals

## Monitoring & Maintenance
- [ ] Setup error tracking (Sentry)
- [ ] Setup uptime monitoring
- [ ] Configure alerts
- [ ] Setup logging (ELK, CloudWatch)
- [ ] Regular security audits
- [ ] Regular backups (daily)
- [ ] Update dependencies regularly

## Documentation & Handover
- [ ] Document deployment process
- [ ] Document API endpoints
- [ ] Document database schema
- [ ] Create runbook for common issues
- [ ] Create admin guide
- [ ] Setup monitoring dashboards

---

# 🚀 DEPLOYMENT COMMANDS

## Option 1: Docker Compose (Recommended)
```bash
# Prepare
git clone your-repo
cd posthub
cp .env.example .env
# Edit .env with production values

# Deploy
docker-compose -f docker-compose.yml up -d

# Check status
docker-compose ps
docker-compose logs -f pocketbase
docker-compose logs -f frontend

# Update
docker-compose pull
docker-compose up -d

# Cleanup
docker-compose down
docker system prune
```

## Option 2: Manual VPS Deployment
```bash
# SSH into server
ssh root@your-server.com

# Install dependencies
curl https://raw.githubusercontent.com/pocketbase/pocketbase/develop/install.sh | bash

# Clone repo
git clone your-repo /var/www/posthub
cd /var/www/posthub

# Setup PocketBase
wget https://github.com/pocketbase/pocketbase/releases/download/v0.20.5/pocketbase_0.20.5_linux_amd64.zip
unzip pocketbase_0.20.5_linux_amd64.zip
chmod +x pocketbase

# Start with systemd
cat > /etc/systemd/system/pocketbase.service << EOF
[Unit]
Description=PocketBase
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/posthub
ExecStart=/var/www/posthub/pocketbase serve --http=127.0.0.1:8090
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl start pocketbase
systemctl enable pocketbase

# Setup nginx
apt-get install nginx
cp nginx.conf /etc/nginx/nginx.conf
systemctl restart nginx

# SSL with Let's Encrypt
apt-get install certbot python3-certbot-nginx
certbot certonly --nginx -d your-domain.com

# Check logs
journalctl -u pocketbase -f
```

## Option 3: Cloud Platform Deployment

### Railway.app
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
railway init

# Deploy
railway up
```

### Vercel (Frontend) + Railway (Backend)
```bash
# Frontend
vercel --prod

# Backend
railway deploy
```

### DigitalOcean App Platform
```bash
# Connect your repo and auto-deploy
# No CLI needed, just push to main branch
```

---

# 🔍 POST-DEPLOYMENT VERIFICATION

## Health Checks
```bash
# Frontend
curl https://your-domain.com

# Backend API
curl https://your-domain.com/api/health

# Admin Panel
curl https://your-domain.com/_/

# Database
curl -X GET https://your-domain.com/api/collections/users/records
```

## Monitoring
```bash
# CPU & Memory
docker stats

# Logs
docker logs -f posthub-pocketbase
docker logs -f posthub-frontend

# Network
curl -I https://your-domain.com

# Database backup
docker exec posthub-pocketbase tar czf pb_data.tar.gz pb_data/
```

## Performance Testing
```bash
# Load test with Apache Bench
ab -n 1000 -c 10 https://your-domain.com

# Check SSL
openssl s_client -connect your-domain.com:443

# Website performance
curl https://www.webpagetest.org/...
```

---

# 🆘 TROUBLESHOOTING PRODUCTION

| Issue | Cause | Solution |
|-------|-------|----------|
| 502 Bad Gateway | Backend down | `docker logs pocketbase` |
| CORS Error | Frontend can't reach API | Check CORS in PB settings |
| Database locked | Concurrent writes | Increase connections in PB config |
| High CPU | Too many requests | Enable caching, implement rate limiting |
| Storage full | Large database | Archive old posts, enable compression |
| SSL error | Expired cert | Renew with `certbot renew` |

---

# 📞 EMERGENCY CONTACTS & RESOURCES

- PocketBase Discord: https://discord.gg/example
- GitHub Issues: https://github.com/pocketbase/pocketbase
- Your Server Provider Support

---

**Last Updated:** March 2024  
**Version:** 1.0.0
