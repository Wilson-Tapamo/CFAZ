/**
 * Enrollments API - CRUD operations
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../db/index.js';
import { enrollments, students } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getDb();

  try {
    if (req.method === 'GET') {
      const { studentId, academicYear, id } = req.query;
      if (id) {
        const [enrollment] = await db.select().from(enrollments)
          .where(eq(enrollments.id, Number(id))).limit(1);
        return res.status(200).json({ enrollment });
      }
      let conditions: any[] = [];
      if (studentId) conditions.push(eq(enrollments.studentId, Number(studentId)));
      if (academicYear && typeof academicYear === 'string') {
        conditions.push(eq(enrollments.academicYear, academicYear));
      }
      const results = await db.select({
        enrollment: enrollments,
        student: students,
      }).from(enrollments)
        .leftJoin(students, eq(enrollments.studentId, students.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(enrollments.createdAt));
      return res.status(200).json({
        enrollments: results.map(r => ({ ...r.enrollment, student: r.student })),
        total: results.length,
      });
    }

    if (req.method === 'POST') {
      const { studentId, academicYear, category } = req.body;
      const existing = await db.select().from(enrollments)
        .where(and(eq(enrollments.studentId, studentId), eq(enrollments.academicYear, academicYear))).limit(1);
      if (existing.length > 0) return res.status(200).json({ enrollment: existing[0], existing: true });
      const [enrollment] = await db.insert(enrollments).values({
        studentId, academicYear, category: category || null, status: 'en_cours', registrationStep: 1,
      }).returning();
      return res.status(201).json({ enrollment });
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID requis' });
      const data = req.body;
      const [updated] = await db.update(enrollments).set({ ...data, updatedAt: new Date() }).where(eq(enrollments.id, Number(id))).returning();
      return res.status(200).json({ enrollment: updated });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Enrollments API error:', error);
    return res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
}
