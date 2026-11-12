# Bandfeed - Bandcamp to RSS/JSON API

# List all recipes
[default]
list:
    @just --list

# Start development server
dev:
    pnpm dev

# Deploy worker to Cloudflare
deploy:
    pnpm deploy

# Run lint checks
lint:
    pnpm lint

# Format code automatically
format:
    pnpm format

# Run type check
check:
    pnpm exec tsc --noEmit

# Generate Cloudflare bindings types
typegen:
    pnpm cf-typegen

# Install dependencies
install:
    pnpm install

# Clean up build artifacts and cache
clean:
    rm -rf .wrangler node_modules

# Run lint, format, and type check
validate: lint format check
