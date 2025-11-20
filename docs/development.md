# Development Guide

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gc-scaffold
   ```

2. **Start development environment**
   ```bash
   ./dock dev
   ```

3. **Open your browser**
   - Navigate to `http://localhost:5173`

## Development Workflow

### Starting Development

Use the `dock` helper script to start the development container:

```bash
./dock dev
```

This will:
- Stop any running containers
- Build the development container
- Start the container with live reload
- Follow logs in the terminal

### Working with the Container

**View logs:**
```bash
./dock logs
```

**Open a shell in the container:**
```bash
./dock shell
```

**Check container status:**
```bash
./dock status
```

**Stop the container:**
```bash
./dock stop
```

**Start in detached mode:**
```bash
./dock detached
```

### Hot Module Replacement

The development environment uses Vite's HMR (Hot Module Replacement):
- Changes to source files are automatically reflected in the browser
- No page refresh needed for most changes
- Fast feedback loop for development

### Environment Variables

Development environment variables are configured in `.env.development`:

- `NODE_ENV`: Set to `development`
- `VITE_PORT`: Port for the dev server (default: 5173)
- `VITE_API_URL`: API endpoint URL

### Debugging

**View container logs:**
```bash
./dock logs
```

**Access container shell:**
```bash
./dock shell
```

**Check running processes:**
```bash
./dock shell
ps aux
```

**View resource usage:**
```bash
./dock status
```

### Rebuilding Containers

If you need to rebuild containers from scratch:

```bash
./dock rebuild
```

This will:
- Stop all containers
- Remove old images
- Rebuild without cache
- Prepare fresh containers

### Common Issues

**Port already in use:**
- Stop any containers using the port: `./dock stop`
- Or change the port in `.env.development`

**Changes not reflecting:**
- Ensure the container is running: `./dock status`
- Check that volumes are mounted correctly
- Try restarting: `./dock stop && ./dock dev`

**Container won't start:**
- Check Docker is running: `docker ps`
- View logs: `docker-compose -f docker-compose.yml logs`
- Rebuild: `./dock rebuild`

## Project Structure

```
src/
├── components/     # Reusable React components
├── pages/         # Page components
├── App.tsx        # Main app component
├── main.tsx       # Application entry point
└── index.css      # Global styles + Tailwind
```

## Adding Dependencies

1. **Install in container:**
   ```bash
   ./dock shell
   npm install <package>
   ```

2. **Or install locally and rebuild:**
   ```bash
   npm install <package>
   ./dock rebuild
   ```

## Running Tests

See [Testing Guide](./testing.md) for detailed testing instructions.

## Storybook

Start Storybook for component development:

```bash
npm run storybook
```

Access at `http://localhost:6006`

