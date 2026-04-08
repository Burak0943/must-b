import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// We use service role key so the webhook can bypass RLS for system operations.
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GÖREV 2: GET method for Meta Verify Token
  if (req.method === 'GET') {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === verifyToken) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }

  // GÖREV 3: POST method for Asynchronous Event Loop
  if (req.method === 'POST') {
    try {
      const body = req.body;
      
      if (body.object) {
        if (
          body.entry &&
          body.entry[0].changes &&
          body.entry[0].changes[0].value.messages &&
          body.entry[0].changes[0].value.messages[0]
        ) {
          const value = body.entry[0].changes[0].value;
          const phoneNumberId = value.metadata.phone_number_id;
          const from = value.messages[0].from;
          const msgBody = value.messages[0].text.body;

          // 1. Process with OpenAI
          const completion = await openai.chat.completions.create({
            messages: [
              { 
                role: "system", 
                content: "You are a Must-b autonomous business intelligence agent. Be concise, professional, and absolute." 
              },
              { role: "user", content: msgBody }
            ],
            model: "gpt-4o-mini", // Using fast model for instantaneous bridge communication
          });

          const replyMessage = completion.choices[0].message.content || 'Action completed natively.';

          // 2. Fetch the first available agent to assign this task to (Simulating routing rules)
          const { data: agentData } = await supabaseAdmin.from('agents').select('*').limit(1).single();
          
          // Insert Task to Supabase to reflect dynamically on the Dashboard
          if (agentData) {
            await supabaseAdmin.from('tasks').insert({
              agent_id: agentData.id,
              user_id: agentData.user_id,
              description: `Replied to WhatsApp user: ${msgBody.substring(0, 30)}...`,
              status: "Completed"
            });
          }

          // 3. Send WhatsApp Reply back to user natively
          const whatsappToken = process.env.WHATSAPP_TOKEN;
          const whatsappApiUrl = process.env.WHATSAPP_API_URL || `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;
          
          if (whatsappToken) {
            await fetch(whatsappApiUrl, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${whatsappToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                messaging_product: "whatsapp",
                to: from,
                text: { body: replyMessage }
              })
            });
          }
        }
        
        // Meta requires a 200 OK response immediately
        return res.status(200).send('EVENT_RECEIVED');
      } else {
        return res.status(404).json({ error: 'Not Found' });
      }
    } catch (error) {
      console.error("WhatsApp Webhook Error: ", error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
