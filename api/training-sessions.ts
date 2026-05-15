import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../db/index.js';
import { trainingSessions, students, enrollments } from '../db/schema.js';
import { eq, desc, and, sql } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getDb();

  // GET - List training sessions
  if (req.method === 'GET') {
    try {
      const { enrollmentId, studentId, category } = req.query;
      
      let conditions: any[] = [];
      if (enrollmentId) conditions.push(eq(trainingSessions.enrollmentId, Number(enrollmentId)));
      if (studentId) conditions.push(eq(trainingSessions.studentId, Number(studentId)));

      const sessions = await db.select({
        session: trainingSessions,
        studentName: students.fullName,
        category: enrollments.category,
      })
      .from(trainingSessions)
      .innerJoin(students, eq(trainingSessions.studentId, students.id))
      .innerJoin(enrollments, eq(trainingSessions.enrollmentId, enrollments.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(trainingSessions.date));

      let filtered = sessions;
      if (category && category !== 'all') {
        filtered = sessions.filter(s => s.category === category);
      }

      return res.status(200).json({ sessions: filtered });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // POST - Create training session
  if (req.method === 'POST') {
    try {
      const { enrollmentId, studentId, date, duration, rpe, type, notes } = req.body;
      
      if (!enrollmentId || !studentId || !date || !duration || !rpe) {
        return res.status(400).json({ error: 'Champs requis manquants' });
      }

      const load = Number(duration) * Number(rpe);

      const [session] = await db.insert(trainingSessions).values({
        enrollmentId: Number(enrollmentId),
        studentId: Number(studentId),
        date,
        duration: Number(duration),
        rpe: Number(rpe),
        load,
        type: type || 'entrainement',
        notes: notes || null,
      }).returning();

      return res.status(201).json({ session });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
