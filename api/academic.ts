import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../db/index.js';
import { academicEvaluations, grades, enrollments, students } from '../db/schema.js';
import { eq, and, desc, sql } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getDb();
  const { type } = req.query;

  try {
    // ─── evaluations ───
    if (type === 'evaluations') {
      if (req.method === 'GET') {
        const { enrollmentId, studentId } = req.query;
        let conditions: any[] = [];
        if (enrollmentId) conditions.push(eq(academicEvaluations.enrollmentId, Number(enrollmentId)));
        if (studentId) conditions.push(eq(academicEvaluations.studentId, Number(studentId)));

        const results = await db.select().from(academicEvaluations)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(desc(academicEvaluations.createdAt));

        const evalsWithGrades = await Promise.all(results.map(async (ev) => {
          const evaluationGrades = await db.select().from(grades).where(eq(grades.evaluationId, ev.id));
          return { ...ev, grades: evaluationGrades };
        }));

        return res.status(200).json({ evaluations: evalsWithGrades });
      }

      if (req.method === 'POST') {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { studentId, enrollmentId, sequence, academicYear, behaviorComment, grades: gradesData } = body;

        if (!studentId || !enrollmentId || !sequence) {
          return res.status(400).json({ error: 'Données manquantes (studentId, enrollmentId ou sequence)' });
        }

        console.log('Creating evaluation for student:', studentId);

        const [evaluation] = await db.insert(academicEvaluations).values({
          studentId: Number(studentId),
          enrollmentId: Number(enrollmentId),
          sequence,
          academicYear: academicYear || '2025-2026',
          behaviorComment: behaviorComment || '',
        }).returning();

        if (!evaluation) {
          throw new Error("Échec de la création de l'en-tête d'évaluation");
        }

        if (gradesData && Array.isArray(gradesData) && gradesData.length > 0) {
          const gradesToInsert = gradesData.map((g: any) => ({
            evaluationId: evaluation.id,
            subject: g.subject,
            score: parseFloat(String(g.score).replace(',', '.')),
            coefficient: parseInt(String(g.coefficient || '1')),
          }));
          
          await db.insert(grades).values(gradesToInsert);
        }

        return res.status(201).json({ evaluation, success: true });
      }

      return res.status(405).json({ error: 'Method not allowed' });
    }

    // ─── reports ───
    if (type === 'reports') {
      if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

      const { category, academicYear } = req.query;
      const year = academicYear as string || '2025-2026';

      let categoryFilter = sql`1=1`;
      if (category && category !== 'all') {
        categoryFilter = eq(enrollments.category, category as string);
      }

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
    }

    // ─── stats ───
    if (type === 'stats') {
      if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

      const { academicYear } = req.query;
      const year = academicYear as string || '2025-2026';

      const allGrades = await db.select({
        score: grades.score,
      }).from(grades)
      .innerJoin(academicEvaluations, eq(grades.evaluationId, academicEvaluations.id))
      .where(eq(academicEvaluations.academicYear, year));

      const globalAvg = allGrades.length > 0 
        ? allGrades.reduce((sum, g) => sum + Number(g.score), 0) / allGrades.length 
        : 0;

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
    }

    return res.status(400).json({ error: 'Type invalide ou manquant' });
  } catch (error: any) {
    console.error('Academic API error:', error);
    return res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
}
