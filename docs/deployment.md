# Deployment Guide

## Production Build

The production build uses a multi-stage Docker build process:

1. **Build Stage**: Compiles TypeScript and builds the React app
2. **Runtime Stage**: Serves static files with nginx

## SSL/HTTPS Configuration

The production container supports SSL/HTTPS with nginx as a reverse proxy.

### Setting Up SSL Certificates

1. **Obtain SSL certificates** (Let's Encrypt, custom CA, or self-signed for testing)

2. **Place certificates in a directory:**
   ```bash
   mkdir -p ssl
   cp your-cert.pem ssl/cert.pem
   cp your-key.pem ssl/key.pem
   ```

3. **Update docker-compose.prod.yml** to mount your certificate directory:
   ```yaml
   volumes:
     - ./ssl:/etc/nginx/ssl:ro
   ```

### Let's Encrypt Certificates

For Let's Encrypt certificates:

```bash
# Install certbot (on host)
sudo apt-get install certbot

# Obtain certificates
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificates to project
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem
```

### Environment Variables

Production environment variables in `.env.production`:

- `NODE_ENV`: `production`
- `HTTP_PORT`: HTTP port (default: 80)
- `HTTPS_PORT`: HTTPS port (default: 443)
- `SSL_ENABLED`: Enable SSL (default: `true`)
- `SSL_CERT_PATH`: Path to SSL certificate (default: `/etc/nginx/ssl/cert.pem`)
- `SSL_KEY_PATH`: Path to SSL key (default: `/etc/nginx/ssl/key.pem`)
- `VITE_API_URL`: Production API URL

## Deploying to Production

### Using Docker Compose

1. **Build and start production container:**
   ```bash
   ./dock prod
   ```

2. **Or use docker-compose directly:**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

### Manual Deployment

1. **Build the production image:**
   ```bash
   docker build -f Dockerfile.prod -t gc-scaffold-prod .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     -p 80:80 \
     -p 443:443 \
     -v $(pwd)/ssl:/etc/nginx/ssl:ro \
     --name gc-scaffold-prod \
     gc-scaffold-prod
   ```

### Production Checklist

- [ ] SSL certificates configured and mounted
- [ ] Environment variables set in `.env.production`
- [ ] Security headers verified in nginx.conf
- [ ] HTTP to HTTPS redirect working
- [ ] Static assets being served correctly
- [ ] Container restart policy set (`unless-stopped`)
- [ ] Logs being collected/monitored
- [ ] Resource limits configured (if needed)

## Nginx Configuration

The production nginx configuration (`nginx.conf`) includes:

- **HTTP to HTTPS redirect** (if SSL enabled)
- **Security headers**:
  - Strict-Transport-Security
  - X-Frame-Options
  - X-Content-Type-Options
  - X-XSS-Protection
  - Referrer-Policy
- **Gzip compression** for text assets
- **Static asset caching** (1 year for immutable assets)
- **SPA routing support** (all routes serve index.html)

## Scaling Considerations

### Horizontal Scaling

For horizontal scaling:
- Use a load balancer (nginx, HAProxy, cloud load balancer)
- Deploy multiple container instances
- Ensure SSL termination at load balancer or each instance

### Vertical Scaling

- Adjust Docker resource limits
- Monitor container resource usage: `./dock status`
- Optimize build size and runtime memory

## Monitoring

### Container Health

Check container status:
```bash
./dock status
```

View logs:
```bash
./dock logs
```

### Resource Monitoring

Monitor resource usage:
```bash
docker stats gc-scaffold-prod
```

## Certificate Renewal

For Let's Encrypt certificates (90-day expiration):

1. **Set up automatic renewal:**
   ```bash
   sudo certbot renew --dry-run
   ```

2. **Create renewal script:**
   ```bash
   #!/bin/bash
   certbot renew
   cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /path/to/project/ssl/cert.pem
   cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /path/to/project/ssl/key.pem
   docker-compose -f docker-compose.prod.yml restart app-prod
   ```

3. **Add to crontab:**
   ```bash
   0 0 * * * /path/to/renewal-script.sh
   ```

## Troubleshooting

**Container won't start:**
- Check SSL certificate paths
- Verify certificate file permissions
- Check nginx logs: `./dock logs`

**SSL errors:**
- Verify certificates are valid
- Check certificate paths in `.env.production`
- Ensure certificates are mounted correctly

**404 errors on routes:**
- Verify nginx.conf includes SPA routing (`try_files`)
- Check that build output is correct

**Performance issues:**
- Enable gzip compression (already configured)
- Verify static asset caching
- Check container resource limits

