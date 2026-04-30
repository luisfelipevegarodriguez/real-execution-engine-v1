-- PoH Gateway: tabla principal + metrica MRR
CREATE TABLE IF NOT EXISTS poh_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nullifier_hash TEXT NOT NULL,
  is_human BOOLEAN NOT NULL,
  confidence FLOAT NOT NULL DEFAULT 0,
  verification_level TEXT DEFAULT 'orb',
  customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indice para evitar doble-gasto del mismo nullifier
CREATE UNIQUE INDEX IF NOT EXISTS idx_nullifier_hash ON poh_verifications(nullifier_hash);

-- Vista KPI: revenue generado (unica metrica que importa)
CREATE OR REPLACE VIEW mrr_poh AS
SELECT
  DATE_TRUNC('day', created_at) AS day,
  COUNT(*) FILTER (WHERE is_human = true) AS successful_verifications,
  COUNT(*) FILTER (WHERE is_human = true) * 0.005 AS revenue_usd_day,
  SUM(COUNT(*) FILTER (WHERE is_human = true) * 0.005) OVER (ORDER BY DATE_TRUNC('day', created_at)) AS cumulative_revenue_usd
FROM poh_verifications
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY day DESC;
