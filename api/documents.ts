/**
 * Documents API - Upload/List documents
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../db/index.js';
import { documents } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getDb();

  try {
    if (req.method === 'GET') {
      const { studentId, enrollmentId } = req.query;
      let conditions: any[] = [];
      if (studentId) conditions.push(eq(documents.studentId, Number(studentId)));
      if (enrollmentId) conditions.push(eq(documents.enrollmentId, Number(enrollmentId)));
      const results = await db.select({ id: documents.id, studentId: documents.studentId, enrollmentId: documents.enrollmentId, type: documents.type, fileName: documents.fileName, mimeType: documents.mimeType, uploadedAt: documents.uploadedAt }).from(documents).where(conditions.length > 0 ? and(...conditions) : undefined);
      return res.status(200).json({ documents: results });
    }

    if (req.method === 'POST') {
      const { studentId, enrollmentId, type, fileName, fileData, mimeType } = req.body;
      const existing = await db.select().from(documents).where(and(eq(documents.studentId, studentId), eq(documents.enrollmentId, enrollmentId), eq(documents.type, type))).limit(1);
      if (existing.length > 0) {
        const [updated] = await db.update(documents).set({ fileName, fileData, mimeType, uploadedAt: new Date() }).where(eq(documents.id, existing[0].id)).returning();
        return res.status(200).json({ document: { ...updated, fileData: undefined } });
      }
      const [doc] = await db.insert(documents).values({ studentId, enrollmentId, type, fileName, fileData, mimeType }).returning();
      return res.status(201).json({ document: { ...doc, fileData: undefined } });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID requis' });
      await db.delete(documents).where(eq(documents.id, Number(id)));
      return res.status(200).json({ deleted: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Documents API error:', error);
    return res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
}
