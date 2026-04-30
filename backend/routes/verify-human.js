const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * POST /verify-human
 * Body: { nullifier_hash, merkle_root, proof, verification_level, action, signal }
 * Returns: { is_human: bool, confidence: float, nullifier_hash }
 */
router.post('/', async (req, res) => {
  const { nullifier_hash, merkle_root, proof, verification_level, action, signal } = req.body;

  if (!nullifier_hash || !proof || !merkle_root) {
    return res.status(400).json({ error: 'Missing required World ID fields' });
  }

  try {
    // Verify against World ID Developer Portal
    const worldRes = await fetch(
      `https://developer.worldcoin.org/api/v1/verify/${process.env.WORLD_APP_ID}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nullifier_hash,
          merkle_root,
          proof,
          verification_level: verification_level || 'orb',
          action: action || 'verify-human',
          signal: signal || ''
        })
      }
    );

    const worldData = await worldRes.json();
    const is_human = worldRes.ok && worldData.success;
    const confidence = is_human ? (verification_level === 'orb' ? 1.0 : 0.7) : 0.0;

    // Log to Supabase (unico KPI: revenue generado)
    await supabase.from('poh_verifications').insert({
      nullifier_hash,
      is_human,
      confidence,
      verification_level: verification_level || 'orb',
      created_at: new Date().toISOString()
    });

    // Stripe billing: $0.005 por verificacion exitosa
    if (is_human && process.env.STRIPE_METER_API_KEY) {
      // Meter event via Stripe Usage API
      await fetch('https://api.stripe.com/v1/billing/meter_events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_METER_API_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          event_name: 'poh_verification',
          payload: JSON.stringify({ stripe_customer_id: req.headers['x-customer-id'] || 'anonymous', value: '1' })
        })
      });
    }

    return res.json({
      is_human,
      confidence,
      nullifier_hash,
      verification_level: verification_level || 'orb'
    });

  } catch (err) {
    console.error('PoH verification error:', err);
    return res.status(500).json({ error: 'Verification failed', details: err.message });
  }
});

module.exports = router;
