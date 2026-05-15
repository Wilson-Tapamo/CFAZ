import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../db/index.js';
import { academicEvaluations, grades, enrollments, students } from '../db/schema.js';
import { eq, avg, count, sql } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const db = getDb();

  try {
    const { academicYear } = req.query;
    const year = academicYear as string || '2025-2026';

    // 1. Global Stats
    const allGrades = await db.select({
      score: grades.score,
    }).from(grades)
    .innerJoin(academicEvaluations, eq(grades.evaluationId, academicEvaluations.id))
    .where(eq(academicEvaluations.academicYear, year));

    const globalAvg = allGrades.length > 0 
      ? allGrades.reduce((sum, g) => sum + Number(g.score), 0) / allGrades.length 
      : 0;

    // 2. Stats by Category
    const categoryStatsRaw = await db.execute(sql`
      SELECT 
        e.category,
        AVG(g.score) as average,
        COUNT(DISTINCT e.student_id) as student_count
      FROM ${enrollments} e
      JOIN ${academicEvaluations} ae ON e.id = ae.enrollment_id
      JOIN ${grades} g ON ae.id = g.evaluation_id
      WHERE ae.academic_year = ${year}
      GROUP BY e.category
    `);

    // 3. Top Students (Lately)
    const topStudentsRaw = await db.execute(sql`
      SELECT 
        s.full_name as name,
        s.photo,
        e.category,
        AVG(g.score) as average
      FROM ${students} s
      JOIN ${enrollments} e ON s.id = e.student_id
      JOIN ${academicEvaluations} ae ON e.id = ae.enrollment_id
      JOIN ${grades} g ON ae.id = g.evaluation_id
      WHERE ae.academic_year = ${year}
      GROUP BY s.id, s.full_name, s.photo, e.category
      ORDER BY average DESC
      LIMIT 5
    `);

    return res.status(200).json({
      global: {
        average: globalAvg.toFixed(2),
        totalEvaluations: allGrades.length,
      },
      categories: categoryStatsRaw.rows,
      topStudents: topStudentsRaw.rows
    });
  } catch (error: any) {
    console.error('Academic Stats API error:', error);
    return res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
}
