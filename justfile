# Bandfeed - Bandcamp to RSS/JSON API

# List all recipes
[default]
list:
    @just --list

# Start development server
dev:
    bun run dev

# Deploy worker to Cloudflare
deploy:
    bun run deploy

# Run lint checks
lint:
    bun run lint

# Format code automatically
format:
    bun run format

# Run type check
check:
    bunx tsc --noEmit

# Generate Cloudflare bindings types
typegen:
    bun run cf-typegen

# Install dependencies
install:
    bun install

# Clean up build artifacts and cache
clean:
    rm -rf .wrangler node_modules

# Run lint, format, and type check
validate: lint format check
