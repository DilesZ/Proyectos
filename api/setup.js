import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try {
    // Create the progress table if it doesn't exist
    // user_id: UUID or identifier for the user/browser
    // data: JSON blob containing the entire progress state
    // updated_at: Timestamp of last update
    await sql`
      CREATE TABLE IF NOT EXISTS progress (
        user_id VARCHAR(255) PRIMARY KEY,
        data JSONB,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    return response.status(200).json({ result: 'Table created successfully' });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
