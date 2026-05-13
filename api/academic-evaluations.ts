/**
 * Academic Evaluations API - Track student school performance
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../db/index.js';
import { academicEvaluations, grades } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getDb();

  try {
    if (req.method === 'GET') {
      const { enrollmentId, studentId } = req.query;
      let conditions: any[] = [];
      if (enrollmentId) conditions.push(eq(academicEvaluations.enrollmentId, Number(enrollmentId)));
      if (studentId) conditions.push(eq(academicEvaluations.studentId, Number(studentId)));

      const results = await db.select().from(academicEvaluations)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(academicEvaluations.createdAt));

      // Fetch grades for each evaluation (could be optimized with a join)
      const evalsWithGrades = await Promise.all(results.map(async (ev) => {
        const evaluationGrades = await db.select().from(grades).where(eq(grades.evaluationId, ev.id));
        return { ...ev, grades: evaluationGrades };
      }));

      return res.status(200).json({ evaluations: evalsWithGrades });
    }

    if (req.method === 'POST') {
      const { studentId, enrollmentId, sequence, academicYear, behaviorComment, grades: gradesData } = req.body;

      // 1. Create the evaluation header
      const [evaluation] = await db.insert(academicEvaluations).values({
        studentId,
        enrollmentId,
        sequence,
        academicYear,
        behaviorComment,
      }).returning();

      // 2. Create the grades entries
      if (gradesData && Array.isArray(gradesData) && gradesData.length > 0) {
        const gradesToInsert = gradesData.map((g: any) => ({
          evaluationId: evaluation.id,
          subject: g.subject,
          score: parseFloat(g.score),
          coefficient: parseInt(g.coefficient || '1'),
        }));
        await db.insert(grades).values(gradesToInsert);
      }

      return res.status(201).json({ evaluation });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Academic Evaluations API error:', error);
    return res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
}
