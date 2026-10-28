# Docker Deployment Guide for Food, Actually Frontend

## Prerequisites

- Docker and Docker Compose installed on your VPS
- Git installed on your VPS

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Wahid-ul/food-actually.git
cd food-actually
```

### 2. Build and run with Docker Compose
```bash
docker-compose up -d --build
```

The frontend will be available at `http://your-vps-ip`

## Manual Docker Build

### 1. Build the Docker image
```bash
docker build -t food-actually-frontend .
```

### 2. Run the container
```bash
docker run -d -p 80:80 --name food-actually-frontend food-actually-frontend
```

## Environment Configuration

1. Copy the example environment file:
```bash
cp .env.docker.example .env
```

2. Update the API base URL in `.env`:
```
VITE_API_BASE_URL=http://your-backend-url:8000
```

## Production Deployment on VPS

### Option 1: Using Docker Compose (Recommended)

1. **SSH into your VPS**
```bash
ssh user@your-vps-ip
```

2. **Clone the repository**
```bash
git clone https://github.com/Wahid-ul/food-actually.git
cd food-actually
```

3. **Configure environment variables**
```bash
cp .env.docker.example .env
nano .env
# Update VITE_API_BASE_URL to your backend URL
```

4. **Build and start**
```bash
docker-compose up -d --build
```

5. **Check logs**
```bash
docker-compose logs -f frontend
```

### Option 2: Using Docker directly

1. **Build on your local machine**
```bash
docker build -t food-actually-frontend .
```

2. **Save the image**
```bash
docker save food-actually-frontend > food-actually-frontend.tar
```

3. **Transfer to VPS**
```bash
scp food-actually-frontend.tar user@your-vps-ip:/tmp/
```

4. **Load on VPS**
```bash
ssh user@your-vps-ip
docker load < /tmp/food-actually-frontend.tar
docker run -d -p 80:80 --name food-actually-frontend food-actually-frontend
```

## Nginx Configuration

The Dockerfile includes a custom nginx configuration that:
- Serves the React SPA with proper routing
- Enables gzip compression
- Adds security headers
- Handles API proxying (uncomment in nginx.conf if needed)

## Updating the Deployment

When you push new changes:

```bash
git pull
docker-compose down
docker-compose up -d --build
```

## Troubleshooting

### Container won't start
```bash
docker logs food-actually-frontend
```

### Port already in use
```bash
# Check what's using port 80
sudo lsof -i :80
# Or use a different port
docker run -d -p 8080:80 --name food-actually-frontend food-actually-frontend
```

### Build fails
```bash
# Clean build
docker-compose down
docker system prune -a
docker-compose up -d --build
```

## Security Notes

- Ensure your VPS firewall allows traffic on port 80
- Consider using SSL/TLS with Let's Encrypt (use nginx with certbot)
- Never commit `.env` files with secrets
- Use environment variables for sensitive data

## Backend Deployment

For backend deployment, you can:
1. Deploy it separately on the same VPS using Docker
2. Use a different VPS
3. Use a managed service like Render, Railway, or Heroku

See the backend repository for Docker configuration.
