# SEO Audit and Recommendation API

A backend API built with Node.js, TypeScript, Express, Prisma, and SQLite that analyzes a website URL and generates a technical SEO audit report.

The API checks important SEO elements, generates recommendations with severity levels, calculates an overall SEO score, and stores audit results in a database.

---

## Overview

This project was built as a backend-focused SEO audit tool for marketing and development teams.

Given a website URL, the API:

1. Normalizes and validates the URL.
2. Fetches the page HTML.
3. Analyzes technical SEO indicators.
4. Checks `robots.txt` and `sitemap.xml`.
5. Analyzes internal and external links.
6. Generates SEO recommendations.
7. Calculates a global score.
8. Saves the audit in a database.
9. Allows users to retrieve previous audits.

---

## Features

- URL normalization and request validation
- HTML fetching with Axios
- Technical SEO analysis using Cheerio
- Title tag analysis
- Meta description analysis
- H1 and H2 heading checks
- Image `alt` attribute checks
- Canonical tag detection
- Viewport tag detection
- `robots.txt` availability check
- `sitemap.xml` availability check
- Internal and external link analysis
- Detection of links without visible text
- SEO recommendations with severity levels
- SEO score calculation
- SQLite persistence using Prisma ORM
- Create and retrieve audits through REST endpoints
- Clean JSON API responses
- Handling of unreachable pages, 404 pages, and network errors

---

## Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite
- **ORM:** Prisma
- **HTTP Client:** Axios
- **HTML Parser:** Cheerio
- **Validation:** Zod
- **Environment Variables:** dotenv
- **Development Tools:** Git, GitHub, VS Code, cURL

---

## Project Architecture

```text
src/
  app.ts
  server.ts

  routes/
    audit.routes.ts

  controllers/
    audit.controller.ts

  services/
    audit.service.ts
    fetch.service.ts
    seo-analyzer.service.ts
    recommendation.service.ts
    scoring.service.ts
    site-files.service.ts

  schemas/
    audit.schema.ts

  utils/
    url.util.ts

  lib/
    prisma.ts

prisma/
  schema.prisma
  migrations/
```

### Architecture Explanation

- **Routes** define the API endpoints.
- **Controllers** handle HTTP requests and responses.
- **Services** contain the business logic.
- **Schemas** validate request bodies.
- **Utils** contain reusable helper functions.
- **Prisma** handles database access and persistence.

This separation keeps the codebase easier to maintain, test, and extend.

---

## API Endpoints

### Health Check

```http
GET /health
```

Checks if the API server is running.

Example response:

```json
{
  "status": "ok",
  "service": "seo-audit-api"
}
```

---

### Create an Audit

```http
POST /api/audits
```

Creates a new SEO audit for a given URL.

Request body:

```json
{
  "url": "https://nodejs.org/en"
}
```

Example response:

```json
{
  "success": true,
  "message": "Audit created successfully",
  "data": {
    "audit": {
      "id": 1,
      "url": "https://nodejs.org/en",
      "score": 83,
      "htmlLength": 12345,
      "statusCode": 200,
      "reachable": true,
      "analysis": {
        "title": "Node.js",
        "titleLength": 7,
        "hasTitle": true,
        "metaDescription": "...",
        "metaDescriptionLength": 120,
        "hasMetaDescription": true,
        "h1Count": 1,
        "h2Count": 4,
        "imageCount": 10,
        "imagesWithoutAlt": 2,
        "hasCanonical": true,
        "hasViewport": true,
        "totalLinks": 50,
        "internalLinksCount": 40,
        "externalLinksCount": 10,
        "linksWithoutText": 1
      },
      "recommendations": [
        {
          "type": "links_without_text",
          "severity": "Low",
          "message": "Some links have no visible text.",
          "recommendation": "Add descriptive anchor text to help users and search engines understand the destination of each link."
        }
      ],
      "siteFiles": {
        "robotsTxt": {
          "url": "https://nodejs.org/robots.txt",
          "exists": true,
          "statusCode": 200
        },
        "sitemapXml": {
          "url": "https://nodejs.org/sitemap.xml",
          "exists": true,
          "statusCode": 200
        }
      },
      "createdAt": "2026-07-02T17:00:08.349Z"
    }
  }
}
```

---

### Get All Audits

```http
GET /api/audits
```

Returns the latest saved audit summaries.

Example response:

```json
{
  "success": true,
  "message": "Audits fetched successfully",
  "data": {
    "audits": [
      {
        "id": 1,
        "url": "https://nodejs.org/en",
        "score": 83,
        "statusCode": 200,
        "reachable": true,
        "createdAt": "2026-07-02T17:00:08.349Z"
      }
    ]
  }
}
```

The list endpoint returns summaries only to keep the response lightweight.

---

### Get Audit by ID

```http
GET /api/audits/:id
```

Returns the full details of one saved audit.

Example:

```http
GET /api/audits/1
```

Example response:

```json
{
  "success": true,
  "message": "Audit fetched successfully",
  "data": {
    "audit": {
      "id": 1,
      "url": "https://nodejs.org/en",
      "score": 83,
      "statusCode": 200,
      "reachable": true,
      "analysis": {},
      "recommendations": [],
      "siteFiles": {},
      "createdAt": "2026-07-02T17:00:08.349Z"
    }
  }
}
```

---

## Error Handling

### Invalid Request Body

If the request body is missing a valid `url` field:

```json
{
  "success": false,
  "message": "Invalid request body",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": []
  }
}
```

---

### Audit Not Found

If an audit ID does not exist:

```json
{
  "success": false,
  "message": "Audit not found",
  "error": {
    "code": "AUDIT_NOT_FOUND"
  }
}
```

---

### Unreachable Page

If the website cannot be reached:

```json
{
  "success": true,
  "message": "Audit created successfully",
  "data": {
    "audit": {
      "url": "https://this-domain-does-not-exist-xyz-123.com",
      "score": 85,
      "htmlLength": 0,
      "statusCode": 0,
      "reachable": false,
      "recommendations": [
        {
          "type": "page_not_reachable",
          "severity": "High",
          "message": "The page could not be reached.",
          "recommendation": "Check that the domain exists, the server is online, and the page is publicly accessible."
        }
      ]
    }
  }
}
```

---

## SEO Score Logic

The audit starts with a score of `100`.

Recommendations reduce the score depending on severity:

```text
High severity   -> -15 points
Medium severity -> -8 points
Low severity    -> -3 points
```

The score never goes below `0`.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/wadhah-95/seo-audit-api.git
cd seo-audit-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
PORT=3000
```

### 4. Run Prisma Migration

```bash
npx prisma migrate dev
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Start Development Server

```bash
npm run dev
```

The API will run on:

```text
http://localhost:3000
```

---

## Useful Commands

Run TypeScript check:

```bash
npx tsc --noEmit
```

Open Prisma Studio:

```bash
npx prisma studio
```

Start development server:

```bash
npm run dev
```

Build project:

```bash
npm run build
```

Start production build:

```bash
npm start
```

---

## Example cURL Commands

### Health Check

```bash
curl http://localhost:3000/health
```

### Create Audit

```bash
curl -X POST http://localhost:3000/api/audits \
  -H "Content-Type: application/json" \
  -d '{"url":"https://nodejs.org/en"}'
```

### Get All Audits

```bash
curl http://localhost:3000/api/audits
```

### Get Audit by ID

```bash
curl http://localhost:3000/api/audits/1
```

### Test Unreachable Website

```bash
curl -X POST http://localhost:3000/api/audits \
  -H "Content-Type: application/json" \
  -d '{"url":"https://this-domain-does-not-exist-xyz-123.com"}'
```

---

## Future Improvements

Possible future improvements include:

- PageSpeed Insights integration
- Broken link checker
- PDF report generation
- Swagger/OpenAPI documentation
- Admin dashboard frontend
- Scheduled audits
- Authentication for admin users
- PostgreSQL deployment
- AI-generated SEO explanations
- Competitor SEO comparison

---

## Project Status

This project is a completed backend V1 focused on technical SEO auditing, clean API design, persistence, and maintainable backend architecture.