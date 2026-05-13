/**
 * Seed API - Initialize database with default admin user
 * Call once after deploying: POST /api/seed
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../src/db/index';
import { users } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const db = getDb();

    // Check if admin already exists
    const existing = await db.select().from(users).where(eq(users.email, 'admin@cfaz.cm')).limit(1);

    if (existing.length > 0) {
      return res.status(200).json({ message: 'Admin déjà créé', seeded: false });
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.insert(users).values({
      email: 'admin@cfaz.cm',
      password: hashedPassword,
      fullName: "Samuel Zo'o",
      role: 'admin',
    });

    return res.status(201).json({ message: 'Admin créé avec succès (admin@cfaz.cm / admin123)', seeded: true });
  } catch (error: any) {
    console.error('Seed error:', error);
    return res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
}
