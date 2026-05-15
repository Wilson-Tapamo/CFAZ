import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../db/index.js';
import { injuries, students, enrollments } from '../db/schema.js';
import { eq, desc, and, isNull } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getDb();

  if (req.method === 'GET') {
    try {
      const { enrollmentId, studentId, category, active } = req.query;
      let conditions: any[] = [];
      if (enrollmentId) conditions.push(eq(injuries.enrollmentId, Number(enrollmentId)));
      if (studentId) conditions.push(eq(injuries.studentId, Number(studentId)));
      if (active === 'true') conditions.push(isNull(injuries.dateReturn));

      const results = await db.select({
        injury: injuries,
        studentName: students.fullName,
        studentPhoto: students.photo,
        category: enrollments.category,
      })
      .from(injuries)
      .innerJoin(students, eq(injuries.studentId, students.id))
      .innerJoin(enrollments, eq(injuries.enrollmentId, enrollments.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(injuries.dateInjury));

      let filtered = results;
      if (category && category !== 'all') {
        filtered = results.filter(r => r.category === category);
      }

      return res.status(200).json({ injuries: filtered });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { enrollmentId, studentId, type, zone, severity, dateInjury, dateReturn, daysOut, treatment, notes } = req.body;
      if (!enrollmentId || !studentId || !type || !zone || !severity || !dateInjury) {
        return res.status(400).json({ error: 'Champs requis manquants' });
      }

      const [injury] = await db.insert(injuries).values({
        enrollmentId: Number(enrollmentId),
        studentId: Number(studentId),
        type, zone, severity, dateInjury,
        dateReturn: dateReturn || null,
        daysOut: daysOut ? Number(daysOut) : null,
        treatment: treatment || null,
        notes: notes || null,
      }).returning();

      return res.status(201).json({ injury });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const { dateReturn, daysOut, notes } = req.body;
      if (!id) return res.status(400).json({ error: 'ID requis' });

      const [updated] = await db.update(injuries)
        .set({ dateReturn, daysOut: daysOut ? Number(daysOut) : null, notes })
        .where(eq(injuries.id, Number(id)))
        .returning();

      return res.status(200).json({ injury: updated });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
