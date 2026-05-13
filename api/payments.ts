/**
 * Payments API - CRUD + payment tracking
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../db/index.js';
import { payments } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getDb();

  try {
    if (req.method === 'GET') {
      const { studentId, enrollmentId } = req.query;
      let conditions: any[] = [];
      if (studentId) conditions.push(eq(payments.studentId, Number(studentId)));
      if (enrollmentId) conditions.push(eq(payments.enrollmentId, Number(enrollmentId)));
      const results = await db.select().from(payments).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(payments.createdAt));
      const totals = { inscription: { due: 750000, paid: 0 }, trousse_sante: { due: 100000, paid: 0 }, kit_sportif: { due: 100000, paid: 0 } };
      for (const p of results) { if (p.category in totals) totals[p.category as keyof typeof totals].paid += p.paidAmount; }
      return res.status(200).json({ payments: results, totals, total: results.length });
    }

    if (req.method === 'POST') {
      const { studentId, enrollmentId, category, paidAmount, method, note } = req.body;
      const amounts: Record<string, number> = { inscription: 750000, trousse_sante: 100000, kit_sportif: 100000 };
      const totalAmount = amounts[category] || 0;
      const existingPayments = await db.select().from(payments).where(and(eq(payments.studentId, studentId), eq(payments.enrollmentId, enrollmentId), eq(payments.category, category)));
      const totalPaid = existingPayments.reduce((sum, p) => sum + p.paidAmount, 0) + paidAmount;
      const status = totalPaid >= totalAmount ? 'paye' : 'partiel';
      const [payment] = await db.insert(payments).values({ studentId, enrollmentId, category, amount: totalAmount, paidAmount, date: new Date().toISOString().split('T')[0], method: method || 'especes', note: note || '', status }).returning();
      return res.status(201).json({ payment, totalPaid, remaining: totalAmount - totalPaid });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Payments API error:', error);
    return res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
}
