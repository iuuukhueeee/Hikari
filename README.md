# Hikari URL Shortener (Cloudflare Workers)

A simple URL shortener built with [Hono](https://hono.dev/) and [Prisma](https://www.prisma.io/) running on Cloudflare Workers with D1 as the database.

## Features

- Shorten URLs with unique, randomly generated short codes
- Redirect to original URLs via short links
- Built on Cloudflare Workers for scalability and low latency
- Uses D1 (SQLite) for persistent storage
- Prisma ORM for database access

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Migrations

```sh
npx wrangler d1 migrations apply your-db --local
```

### 3. Generate Prisma types

```sh
npx prisma generate
```

### 3. Run the development server

```sh
npm run dev
```

### 4. Deploy to Cloudflare Workers

```sh
npm run deploy
```

### 5. Generate Cloudflare Types

```sh
npm run cf-typegen
```

## Usage

To shorten a URL, send a GET request to the root endpoint with the `url` query parameter:

```
GET /?url=https://example.com
```

Or even faster with shell function
```bash
hikari() {
  curl -s https://hikari.nguyenducthien9.workers.dev/ \
    -H "Content-Type: application/json" \
    -d "{\"originalUrl\": \"$1\"}"
}

hikari https://www.example.com
```

## Example Response

```json
{
  "id": 1,
  "originalUrl": "https://example.com",
  "shortUrl": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "description": null
}
```

## Environment Variables

Configure your D1 database binding in your .env and wrangler.jsonc.

## Database

- Migrations are stored in the migrations/ directory.
- Prisma schema is in prisma/schema.prisma.

## License

This project is licensed under the GNU Affero General Public License v3.0. See LICENSE for details.

## Contact:

For questions or contributions, please open an issue or pull request.
