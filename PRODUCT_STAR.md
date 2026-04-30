# 🌟 Producto Estrella: PoH Gateway API

> Unica metrica: **revenue_usd generado en 30 dias** (vista `mrr_poh` en Supabase)

## Endpoint
```
POST /verify-human
```

### Body
```json
{
  "nullifier_hash": "0x...",
  "merkle_root": "0x...",
  "proof": "0x...",
  "verification_level": "orb",
  "action": "verify-human",
  "signal": ""
}
```

### Response
```json
{
  "is_human": true,
  "confidence": 1.0,
  "nullifier_hash": "0x...",
  "verification_level": "orb"
}
```

## Precio
- $0.005 por verificacion exitosa (pay-per-use via Stripe Metered Billing)
- Sin subscription, sin setup fee

## Stack de referencia
- World ID Developer Portal: https://developer.worldcoin.org
- Whitepaper: https://whitepaper.world.org/building-world
- Base: real-execution-engine-v1

## KPI unico (30 dias)
```sql
SELECT * FROM mrr_poh;
```
