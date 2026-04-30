# ⚡ Real Execution Engine v1

> Todo input → DECISIÓN → VALOR → ACCIÓN → DEPLOY → DINERO

## Stack
- **n8n** — orquestación de flujos
- **OpenAI API** — cerebro decisor
- **Supabase** — memoria + logs
- **GitHub Actions** — CI/CD automático
- **Vercel / Cloud Run** — ejecución
- **Stripe** — monetización

## Quickstart

```bash
git clone https://github.com/luisfelipevegarodriguez/real-execution-engine-v1
cd real-execution-engine-v1
cp .env.example .env   # fill your keys
docker-compose up -d
```

## Arquitectura

```
Webhook → n8n Orchestrator → LLM Core
                              ├─ Knowledge Store (Supabase)
                              ├─ Code Generator
                              ├─ Deploy Engine (GitHub Actions)
                              └─ Monetization Engine (Stripe)
                                        ↓
                              Observability + Feedback Loop
```

## Variables de entorno requeridas
Ver `.env.example`

## Estructura
```
/backend       — API Express + decisor LLM
/n8n           — flujo exportado listo para importar
/infra         — Dockerfile + docker-compose
/.github       — CI/CD pipeline
```
