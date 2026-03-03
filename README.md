# Bandfeed

API for converting Bandcamp band and user pages into clean JSON and RSS feeds. Built with **Hono**, **Cloudflare Workers**, and **HTMLRewriter**.

## Features

- **Band Releases**: Get all releases from an artist subdomain and get RSS feed for it.
- **Detailed Albums**: Fetch full album data, including tracklists, release dates, and tags.
- **Detailed Tracks**: Get individual track metadata, including lyrics, credits, and streaming links.
- **User Collection**: Track purchased items from any user profile and get RSS feed for it.
- **User Wishlist**: Monitor wishlist items from any user and get RSS feed for it.
- **OpenAPI/Swagger**: Built-in interactive documentation and testing UI.

## Usage

The root path `/` redirects to the **Swagger UI**, where you can explore and test all available endpoints

## Development

We use `just` as a command runner you can run `just list` or `just` to see all available commands.

We also use `mise` to manage our dependencies. You can run `mise install` to install all the dependencies.

## Tech Stack

- [Hono](https://hono.dev/) - Web Framework
- [Zod](https://zod.dev/) - Validation & OpenAPI spec generation
- [Biome](https://biomejs.dev/) - Blazing fast linting & formatting
- [HTMLRewriter](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/) - High-performance streaming parser
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) - Cloudflare Workers CLI
- [Mise](https://mise.jdx.dev/) - Dependency management
- [Just](https://just.systems/) - Command runner
