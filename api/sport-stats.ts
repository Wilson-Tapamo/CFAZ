import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../db/index.js';
import { trainingSessions, physicalTests, injuries, students, enrollments } from '../db/schema.js';
import { eq, sql, isNull, avg, count, desc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const db = getDb();

  try {
    const { studentId, category } = req.query;

    // Team averages for physical tests (for comparison radar chart)
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

    // Player latest test (if studentId provided)
    let playerLatest = null;
    if (studentId) {
      const [latest] = await db.select()
        .from(physicalTests)
        .where(eq(physicalTests.studentId, Number(studentId)))
        .orderBy(desc(physicalTests.date))
        .limit(1);
      playerLatest = latest || null;
    }

    // Active injuries count
    const [injuryStats] = await db.select({
      activeCount: count(),
    }).from(injuries).where(isNull(injuries.dateReturn));

    // Team training load (last 7 days avg)
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
  } catch (error: any) {
    console.error('Sport Stats API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
