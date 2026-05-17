/**
 * Auth API - Login & Seed endpoints
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type } = req.query;

  try {
    const db = getDb();

    // ─── Seed Logic ───
    if (type === 'seed') {
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
    }

    // ─── Login Logic (Default) ───
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const { password: _, ...safeUser } = user;
    return res.status(200).json({ user: safeUser });
  } catch (error: any) {
    console.error('Auth API error:', error);
    return res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
}
