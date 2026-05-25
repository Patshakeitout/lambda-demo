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

### Backend
```bash
npm install
npx tsc
serverless deploy
```

### Frontend
```bash
cd fe
npm install
ng build
```

Das Build-Output (`fe/dist/`) kann auf einem Webserver oder S3/CloudFront gehostet werden. Die API-URL muss in `fe/src/app/shop.service.ts` eingetragen werden.

## Lokale Entwicklung

```bash
# Backend
serverless dev

# Frontend (separates Terminal)
cd fe
npm install
ng serve
```

Frontend läuft dann auf `http://localhost:4200`, Backend-Endpunkte werden direkt gegen AWS aufgerufen.
