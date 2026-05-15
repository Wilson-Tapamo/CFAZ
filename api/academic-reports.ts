import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../db/index.js';
import { academicEvaluations, grades, enrollments, students } from '../db/schema.js';
import { eq, sql, and } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const db = getDb();

  try {
    const { category, academicYear } = req.query;
    const year = academicYear as string || '2025-2026';

    let categoryFilter = sql`1=1`;
    if (category && category !== 'all') {
      categoryFilter = eq(enrollments.category, category as string);
    }

    // Get all students with their latest average and evaluation count
    const studentReports = await db.execute(sql`
      WITH student_averages AS (
        SELECT 
          ae.enrollment_id,
          ae.sequence,
          AVG(g.score) as seq_avg,
          ae.created_at
        FROM ${academicEvaluations} ae
        JOIN ${grades} g ON ae.id = g.evaluation_id
        WHERE ae.academic_year = ${year}
        GROUP BY ae.id, ae.enrollment_id, ae.sequence, ae.created_at
      ),
      latest_evals AS (
        SELECT 
          enrollment_id,
          MAX(created_at) as last_eval_date
        FROM ${academicEvaluations}
        WHERE academic_year = ${year}
        GROUP BY enrollment_id
      )
      SELECT 
        s.id as student_id,
        s.full_name,
        s.photo,
        e.id as enrollment_id,
        e.category,
        e.status as enrollment_status,
        (SELECT AVG(seq_avg) FROM student_averages WHERE enrollment_id = e.id) as global_average,
        (SELECT sequence FROM student_averages WHERE enrollment_id = e.id AND created_at = le.last_eval_date LIMIT 1) as last_sequence,
        (SELECT COUNT(*) FROM ${academicEvaluations} WHERE enrollment_id = e.id AND academic_year = ${year}) as evaluation_count
      FROM ${students} s
      JOIN ${enrollments} e ON s.id = e.student_id
      LEFT JOIN latest_evals le ON e.id = le.enrollment_id
      WHERE ${categoryFilter}
      ORDER BY global_average DESC NULLS LAST
    `);

    return res.status(200).json({ reports: studentReports.rows });
  } catch (error: any) {
    console.error('Academic Reports API error:', error);
    return res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
}
