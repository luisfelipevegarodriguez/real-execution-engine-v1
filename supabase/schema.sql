-- Tabla principal de logs de ejecución
CREATE TABLE IF NOT EXISTS execution_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  input TEXT NOT NULL,
  decision JSONB NOT NULL,
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  result_money NUMERIC DEFAULT 0,
  impact_score INTEGER,
  notes TEXT
);

-- Índice para queries rápidas por fecha
CREATE INDEX idx_execution_logs_ts ON execution_logs(ts DESC);

-- Vista de ROI tracking
CREATE VIEW roi_summary AS
SELECT
  DATE_TRUNC('day', ts) AS day,
  COUNT(*) AS executions,
  SUM(result_money) AS total_revenue,
  AVG(impact_score) AS avg_impact
FROM execution_logs
GROUP BY 1
ORDER BY 1 DESC;
