/**
 * Students API - CRUD operations
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../src/db/index';
import { students, enrollments } from '../src/db/schema';
import { eq, desc, like, sql } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getDb();

  try {
    // GET - List students or get single student
    if (req.method === 'GET') {
      const { id, search, academicYear } = req.query;

      if (id) {
        const [student] = await db.select().from(students).where(eq(students.id, Number(id))).limit(1);
        if (!student) return res.status(404).json({ error: 'Élève non trouvé' });

        // Get enrollments for this student
        const studentEnrollments = await db.select().from(enrollments)
          .where(eq(enrollments.studentId, Number(id)))
          .orderBy(desc(enrollments.createdAt));

        return res.status(200).json({ student, enrollments: studentEnrollments });
      }

      // List all students with optional search
      let query = db.select({
        student: students,
        enrollment: enrollments,
      }).from(students)
        .leftJoin(enrollments, eq(students.id, enrollments.studentId))
        .orderBy(desc(students.createdAt));

      const results = await query;

      // Group by student, attach latest enrollment
      const studentMap = new Map();
      for (const row of results) {
        if (!studentMap.has(row.student.id)) {
          studentMap.set(row.student.id, { ...row.student, enrollment: row.enrollment });
        }
      }

      let studentList = Array.from(studentMap.values());

      // Filter by search if provided
      if (search && typeof search === 'string') {
        const s = search.toLowerCase();
        studentList = studentList.filter((st: any) =>
          st.fullName.toLowerCase().includes(s) ||
          st.city?.toLowerCase().includes(s) ||
          st.phone?.includes(s)
        );
      }

      // Filter by academic year
      if (academicYear && typeof academicYear === 'string') {
        studentList = studentList.filter((st: any) =>
          st.enrollment?.academicYear === academicYear
        );
      }

      return res.status(200).json({ students: studentList, total: studentList.length });
    }

    // POST - Create new student
    if (req.method === 'POST') {
      const data = req.body;

      const [newStudent] = await db.insert(students).values({
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        placeOfBirth: data.placeOfBirth,
        nationality: data.nationality || 'Camerounaise',
        sex: data.sex,
        address: data.address,
        city: data.city,
        region: data.region,
        phone: data.phone,
        photo: data.photo,
        parentName: data.parentName,
        parentRelation: data.parentRelation,
        parentProfession: data.parentProfession,
        parentPhone: data.parentPhone,
        parentEmail: data.parentEmail,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        school: data.school,
        classLevel: data.classLevel,
        academicYearSchool: data.academicYearSchool,
        averageGrade: data.averageGrade ? parseFloat(data.averageGrade) : null,
        currentClub: data.currentClub,
        positions: data.positions ? JSON.stringify(data.positions) : null,
        yearsOfPractice: data.yearsOfPractice ? parseInt(data.yearsOfPractice) : null,
        otherSports: data.otherSports,
      }).returning();

      return res.status(201).json({ student: newStudent });
    }

    // PUT - Update student
    if (req.method === 'PUT') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID requis' });

      const data = req.body;
      const [updated] = await db.update(students)
        .set({
          ...data,
          positions: data.positions ? JSON.stringify(data.positions) : undefined,
          averageGrade: data.averageGrade ? parseFloat(data.averageGrade) : undefined,
          yearsOfPractice: data.yearsOfPractice ? parseInt(data.yearsOfPractice) : undefined,
          updatedAt: new Date(),
        })
        .where(eq(students.id, Number(id)))
        .returning();

      return res.status(200).json({ student: updated });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Students API error:', error);
    return res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
}
