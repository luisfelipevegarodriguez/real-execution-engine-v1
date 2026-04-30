import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `Eres un motor autónomo de ejecución y optimización de valor.
Reglas:
1. Todo input debe convertirse en acción ejecutable.
2. Prioriza impacto económico o estratégico real.
3. Elimina información sin utilidad directa.
4. Si algo es automatizable, genera sistema, no explicación.
5. Si algo es deployable, produce estructura lista para producción.
6. Si algo genera dinero, diseña mecanismo de monetización.

Devuelve SIEMPRE JSON válido con:
{
  "decision": "string",
  "value": "alto|medio|bajo",
  "action": "generate_repo_and_deploy|create_automation|monetize|store_knowledge|discard",
  "system": "descripción del sistema a construir",
  "next_step": "acción inmediata siguiente",
  "impact": 1-10
}`;

export async function decideAction(input) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: input },
    ],
  });
  return JSON.parse(response.choices[0].message.content);
}
