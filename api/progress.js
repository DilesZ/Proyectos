import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  // Allow simple CORS for local development if needed, though Vercel handles this mostly
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  const { userId } = request.query;

  if (!userId) {
    return response.status(400).json({ error: 'Missing userId parameter' });
  }

  try {
    if (request.method === 'GET') {
      const result = await sql`SELECT data FROM progress WHERE user_id = ${userId};`;
      if (result.rows.length > 0) {
        return response.status(200).json(result.rows[0].data);
      } else {
        return response.status(200).json(null); // No data yet
      }
    } else if (request.method === 'POST') {
      const data = request.body; // Expecting JSON body
      
      // Upsert: Insert or Update on conflict
      await sql`
        INSERT INTO progress (user_id, data, updated_at)
        VALUES (${userId}, ${data}::jsonb, NOW())
        ON CONFLICT (user_id)
        DO UPDATE SET data = ${data}::jsonb, updated_at = NOW();
      `;
      
      return response.status(200).json({ success: true });
    } else {
      return response.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: error.message });
  }
}
