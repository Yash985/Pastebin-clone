# Pastebin-Lite

A lightweight Pastebin-clone that allows users to create text pastes with optional expiry and view-count constraints.

## Local Setup

1. **Clone the repository.**
2. **Install dependencies**: `npm install`.
3. **Configure Environment**: Create a `.env.local` file with the following:
   - `UPSTASH_REDIS_REST_URL=your_url`
   - `UPSTASH_REDIS_REST_TOKEN=your_token`
   - `TEST_MODE=1`
   - `NEXT_PUBLIC_BASE_URL=http://localhost:3000`
4. **Run development server**: `npm run dev`.

## Persistence Layer

This application uses **Upstash Redis** for data persistence.

- **Reasoning**: Redis is ideal for serverless environments like Vercel because it handles connection pooling efficiently.
- **Constraints**: It natively supports Time-to-Live (TTL), which simplifies the implementation of the expiry requirement.

## Design Decisions

- Deterministic Testing\*\*: Implemented `x-test-now-ms` header support for expiry logic as required by the test suite.
- **Atomic Operations**: View counts are checked and decremented server-side to prevent negative counts.
- **Safe Rendering**: All content is rendered within standard React text nodes to prevent XSS/script execution.
