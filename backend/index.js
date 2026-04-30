import express from 'express';
import { decideAction } from './decider.js';
import { logToSupabase } from './db.js';

const app = express();
app.use(express.json());

// Webhook principal — recibe cualquier input
app.post('/execute', async (req, res) => {
  const { input } = req.body;
  if (!input) return res.status(400).json({ error: 'input required' });

  const decision = await decideAction(input);
  await logToSupabase({ input, decision, ts: new Date().toISOString() });

  // Si acción es deploy, dispara GitHub Actions
  if (decision.action === 'generate_repo_and_deploy') {
    await triggerDeploy(decision);
  }

  res.json(decision);
});

// Stripe webhook para confirmar pagos
app.post('/stripe-webhook', express.raw({ type: 'application/json' }), (req, res) => {
  // Maneja eventos: checkout.session.completed, invoice.paid
  const event = JSON.parse(req.body);
  console.log('Stripe event:', event.type);
  res.json({ received: true });
});

async function triggerDeploy(decision) {
  await fetch(`https://api.github.com/repos/${process.env.GH_REPO}/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ event_type: 'auto-deploy', client_payload: decision }),
  });
}

app.listen(process.env.PORT || 3000, () => console.log('Engine running'));
