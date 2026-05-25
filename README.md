# Lambda Demo — Mobile Shop Finder

Eine Full-Stack-Demo-App zum Suchen von Mobilfunk-Shops, gebaut mit AWS Lambda, DynamoDB und Angular.

## Architektur

```
┌─────────────────────┐        ┌──────────────────────────────┐
│   Angular Frontend  │──HTTP──▶   AWS API Gateway (HTTP API) │
│   (fe/)             │        └──────────────┬───────────────┘
└─────────────────────┘                       │
                                              ▼
                                   ┌─────────────────────┐
                                   │   AWS Lambda        │
                                   │   (Node.js 20 / TS) │
                                   └──────────┬──────────┘
                                              │
                                              ▼
                                   ┌─────────────────────┐
                                   │   DynamoDB          │
                                   │   (mobile-shops)    │
                                   └─────────────────────┘
```

- **Frontend** — Angular SPA in `fe/`, kommuniziert direkt mit der API Gateway URL
- **Backend** — TypeScript Lambda-Funktionen in `src/`, deployed via Serverless Framework v4
- **Datenbank** — DynamoDB-Tabelle `mobile-shops` in `eu-north-1`
- **API-Endpunkte** — `GET /shops/{id}`, `GET /shops/region/{region}`, `GET /shops/city/{city}/check`

## Deployment

```bash
npm install
npx tsc
serverless deploy
```

## Lokale Entwicklung

```bash
# Backend
serverless dev

# Frontend
cd fe
npm install
ng serve
```
