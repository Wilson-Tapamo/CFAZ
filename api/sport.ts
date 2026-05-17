import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../db/index.js';
import { trainingSessions, physicalTests, injuries, students, enrollments } from '../db/schema.js';
import { eq, desc, and, sql, isNull, avg, count } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getDb();
  const { type } = req.query;

  try {
    // ─── training ───
    if (type === 'training') {
      if (req.method === 'GET') {
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
      }

      if (req.method === 'POST') {
        const { enrollmentId, studentId, date, duration, rpe, type: sessionType, notes } = req.body;
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
          type: sessionType || 'entrainement',
          notes: notes || null,
        }).returning();

        return res.status(201).json({ session });
      }

      return res.status(405).json({ error: 'Method not allowed' });
    }

    // ─── physical-tests ───
    if (type === 'physical') {
      if (req.method === 'GET') {
        const { enrollmentId, studentId, category } = req.query;
        let conditions: any[] = [];
        if (enrollmentId) conditions.push(eq(physicalTests.enrollmentId, Number(enrollmentId)));
        if (studentId) conditions.push(eq(physicalTests.studentId, Number(studentId)));

        const tests = await db.select({
          test: physicalTests,
          studentName: students.fullName,
          category: enrollments.category,
        })
        .from(physicalTests)
        .innerJoin(students, eq(physicalTests.studentId, students.id))
        .innerJoin(enrollments, eq(physicalTests.enrollmentId, enrollments.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(physicalTests.date));

        let filtered = tests;
        if (category && category !== 'all') {
          filtered = tests.filter(t => t.category === category);
        }

        return res.status(200).json({ tests: filtered });
      }

      if (req.method === 'POST') {
        const { enrollmentId, studentId, date, sprint30m, yoyoTest, verticalJump, agility, strength, vma, jonglerie, notes } = req.body;
        if (!enrollmentId || !studentId || !date) {
          return res.status(400).json({ error: 'Champs requis manquants' });
        }

        const parseNum = (v: any) => v !== undefined && v !== '' && v !== null ? Number(String(v).replace(',', '.')) : null;

        const [test] = await db.insert(physicalTests).values({
          enrollmentId: Number(enrollmentId),
          studentId: Number(studentId),
          date,
          sprint30m: parseNum(sprint30m),
          yoyoTest: parseNum(yoyoTest),
          verticalJump: parseNum(verticalJump),
          agility: parseNum(agility),
          strength: parseNum(strength),
          vma: parseNum(vma),
          jonglerie: jonglerie ? Number(jonglerie) : null,
          notes: notes || null,
        }).returning();

        return res.status(201).json({ test });
      }

      return res.status(405).json({ error: 'Method not allowed' });
    }

    // ─── injuries ───
    if (type === 'injuries') {
      if (req.method === 'GET') {
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
      }

      if (req.method === 'POST') {
        const { enrollmentId, studentId, type: injuryType, zone, severity, dateInjury, dateReturn, daysOut, treatment, notes } = req.body;
        if (!enrollmentId || !studentId || !injuryType || !zone || !severity || !dateInjury) {
          return res.status(400).json({ error: 'Champs requis manquants' });
        }

        const [injury] = await db.insert(injuries).values({
          enrollmentId: Number(enrollmentId),
          studentId: Number(studentId),
          type: injuryType, zone, severity, dateInjury,
          dateReturn: dateReturn || null,
          daysOut: daysOut ? Number(daysOut) : null,
          treatment: treatment || null,
          notes: notes || null,
        }).returning();

        return res.status(201).json({ injury });
      }

      if (req.method === 'PUT') {
        const { id } = req.query;
        const { dateReturn, daysOut, notes } = req.body;
        if (!id) return res.status(400).json({ error: 'ID requis' });

        const [updated] = await db.update(injuries)
          .set({ dateReturn, daysOut: daysOut ? Number(daysOut) : null, notes })
          .where(eq(injuries.id, Number(id)))
          .returning();

        return res.status(200).json({ injury: updated });
      }

      return res.status(405).json({ error: 'Method not allowed' });
    }

    // ─── stats ───
    if (type === 'stats') {
      if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

      const { studentId, category } = req.query;

      let teamAvgQuery = db.select({
        avgSprint: avg(physicalTests.sprint30m),
        avgYoyo: avg(physicalTests.yoyoTest),
        avgJump: avg(physicalTests.verticalJump),
        avgAgility: avg(physicalTests.agility),
        avgStrength: avg(physicalTests.strength),
        avgVma: avg(physicalTests.vma),
        avgJonglerie: avg(physicalTests.jonglerie),
      }).from(physicalTests);

      if (category && category !== 'all') {
        teamAvgQuery = teamAvgQuery
          .innerJoin(enrollments, eq(physicalTests.enrollmentId, enrollments.id))
          .where(eq(enrollments.category, category as string)) as any;
      }

      const [teamAvg] = await teamAvgQuery;

      let playerLatest = null;
      if (studentId) {
        const [latest] = await db.select()
          .from(physicalTests)
          .where(eq(physicalTests.studentId, Number(studentId)))
          .orderBy(desc(physicalTests.date))
          .limit(1);
        playerLatest = latest || null;
      }

      const [injuryStats] = await db.select({
        activeCount: count(),
      }).from(injuries).where(isNull(injuries.dateReturn));

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekStr = weekAgo.toISOString().split('T')[0];

      const [loadStats] = await db.select({
        avgLoad: avg(trainingSessions.load),
        totalSessions: count(),
      }).from(trainingSessions)
      .where(sql`${trainingSessions.date} >= ${weekStr}`);

      return res.status(200).json({
        teamAverages: teamAvg,
        playerLatest,
        injuryStats: { active: Number(injuryStats?.activeCount) || 0 },
        weeklyLoad: {
          avgLoad: loadStats?.avgLoad ? Number(loadStats.avgLoad).toFixed(0) : '0',
          totalSessions: Number(loadStats?.totalSessions) || 0,
        },
      });
    }

    return res.status(400).json({ error: 'Type invalide ou manquant' });
  } catch (error: any) {
    console.error('Sport API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
