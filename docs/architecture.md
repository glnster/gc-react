# System Architecture

## Overview

GC Scaffold is a Docker-based development and production scaffold for React applications with Tailwind CSS. It provides a complete containerized environment for both local development and production deployment.

## Architecture Components

### Development Environment

- **Container**: `app-dev` (from `docker-compose.yml`)
- **Base Image**: `node:20-alpine`
- **Purpose**: Local development with hot module replacement
- **Port**: 5173 (configurable via `.env.development`)
- **Features**:
  - Live reload via Vite HMR
  - Volume mounting for source code
  - Development dependencies included

### Production Environment

- **Container**: `app-prod` (from `docker-compose.prod.yml`)
- **Build Process**: Multi-stage Docker build
  - Stage 1: Build React app using Vite
  - Stage 2: Serve static files with nginx
- **Base Image**: `nginx:alpine` (final stage)
- **Ports**: 
  - 80 (HTTP)
  - 443 (HTTPS/SSL)
- **Features**:
  - Optimized production build
  - SSL/HTTPS support
  - Security headers
  - Gzip compression
  - Static asset caching

## Docker Setup

### Development Container

The development container runs the Vite dev server directly, providing:
- Fast hot module replacement
- Source maps for debugging
- Full development tooling

### Production Container

The production container uses a multi-stage build:
1. **Builder Stage**: Compiles TypeScript and builds the React application
2. **Runtime Stage**: Serves the built static files using nginx

This approach minimizes the final image size while maintaining all build capabilities.

## Container Communication

- Containers are isolated and communicate only through exposed ports
- No inter-container dependencies (single-service architecture)
- Environment variables are injected via `.env` files

## Volume Management

### Development
- Source code: Mounted as volume for live reload
- `node_modules`: Named volume to prevent host/container conflicts

### Production
- SSL certificates: Mounted read-only volume for security
- Static assets: Built into the image (no volumes needed)

## Network Configuration

- Development: Single container, no networking between services
- Production: Single container with HTTP/HTTPS endpoints

## Security Considerations

- Production container runs as non-root user (nginx default)
- SSL certificates mounted read-only
- Security headers configured in nginx
- Environment variables for sensitive configuration
- `.dockerignore` prevents sensitive files from being copied

