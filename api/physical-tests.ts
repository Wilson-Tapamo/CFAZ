import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../db/index.js';
import { physicalTests, students, enrollments } from '../db/schema.js';
import { eq, desc, and } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getDb();

  // GET - List physical tests
  if (req.method === 'GET') {
    try {
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
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // POST - Create physical test
  if (req.method === 'POST') {
    try {
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
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
