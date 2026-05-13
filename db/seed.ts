import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.ts';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('🌱 Seeding database...');

  // 1. Create Test Admin
  const testEmail = 'test@cfaz.cm';
  const hashedPassword = await bcrypt.hash('test1234', 10);
  
  await db.insert(schema.users).values({
    email: testEmail,
    password: hashedPassword,
    fullName: 'Test Manager',
    role: 'admin',
  }).onConflictDoNothing();

  console.log(`✅ Test user created: ${testEmail} / test1234`);

  // 2. Create Fake Students
  const fakeStudents = [
    {
      fullName: 'Moussa Diallo',
      dateOfBirth: '2012-05-12',
      placeOfBirth: 'Douala',
      sex: 'M' as const,
      city: 'Douala',
      region: 'Littoral',
      phone: '+237 677889900',
      parentName: 'Ibrahim Diallo',
      parentRelation: 'pere' as const,
      parentPhone: '+237 699001122',
      school: 'Lycée de Joss',
      classLevel: '4ème',
      academicYearSchool: '2025-2026',
      averageGrade: 14.5,
      currentClub: 'Ecole de Football des Brasseries',
      positions: JSON.stringify(['Milieu Central', 'Milieu Offensif']),
      yearsOfPractice: 4,
    },
    {
      fullName: 'Samuel Ndongo',
      dateOfBirth: '2014-03-20',
      placeOfBirth: 'Yaoundé',
      sex: 'M' as const,
      city: 'Yaoundé',
      region: 'Centre',
      phone: '+237 670112233',
      parentName: 'Marie Ndongo',
      parentRelation: 'mere' as const,
      parentPhone: '+237 691112233',
      school: 'College Vogt',
      classLevel: '6ème',
      academicYearSchool: '2025-2026',
      averageGrade: 12.8,
      currentClub: 'Canon Yaoundé U13',
      positions: JSON.stringify(['Gardien']),
      yearsOfPractice: 2,
    },
    {
      fullName: 'Marc Atangana',
      dateOfBirth: '2010-08-15',
      placeOfBirth: 'Edéa',
      sex: 'M' as const,
      city: 'Edéa',
      region: 'Littoral',
      phone: '+237 671111111',
      parentName: 'Jean Atangana',
      parentRelation: 'pere' as const,
      parentPhone: '+237 691111111',
      school: 'Lycée Technique Edéa',
      classLevel: '2nde',
      academicYearSchool: '2024-2025',
      averageGrade: 11.2,
      currentClub: 'Libre',
      positions: JSON.stringify(['Défenseur Central']),
      yearsOfPractice: 5,
    },
    {
      fullName: 'Alain Biyik',
      dateOfBirth: '2011-11-30',
      placeOfBirth: 'Kribi',
      sex: 'M' as const,
      city: 'Kribi',
      region: 'Sud',
      phone: '+237 672222222',
      parentName: 'Paul Biyik',
      parentRelation: 'tuteur' as const,
      parentPhone: '+237 692222222',
      school: 'Collège Bilingue de Kribi',
      classLevel: '3ème',
      academicYearSchool: '2025-2026',
      averageGrade: 15.1,
      currentClub: 'Kribi FC',
      positions: JSON.stringify(['Attaquant', 'Ailier Droit']),
      yearsOfPractice: 3,
    },
    {
      fullName: 'Kevin Song',
      dateOfBirth: '2013-01-10',
      placeOfBirth: 'Bafoussam',
      sex: 'M' as const,
      city: 'Bafoussam',
      region: 'Ouest',
      phone: '+237 673333333',
      parentName: 'Rigobert Song Sr',
      parentRelation: 'pere' as const,
      parentPhone: '+237 693333333',
      school: 'Lycée Classique Bafoussam',
      classLevel: '5ème',
      academicYearSchool: '2025-2026',
      averageGrade: 13.0,
      currentClub: 'Racing Bafoussam',
      positions: JSON.stringify(['Milieu Défensif']),
      yearsOfPractice: 4,
    }
  ];

  const insertedStudents = await db.insert(schema.students).values(fakeStudents).returning();
  console.log(`✅ ${insertedStudents.length} students created`);

  // 3. Create Enrollments
  const academicYears = ['2024-2025', '2025-2026'];
  const statuses = ['complet', 'incomplet', 'en_cours'] as const;
  const categories = ['U13', 'U15', 'U17'];

  for (const student of insertedStudents) {
    const year = student.fullName === 'Marc Atangana' ? '2024-2025' : '2025-2026';
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];

    await db.insert(schema.enrollments).values({
      studentId: student.id,
      academicYear: year,
      status: status,
      category: category,
      registrationStep: status === 'complet' ? 6 : 4,
    });
  }

  console.log('✅ Enrollments created');

  // 4. Create some payments
  for (const student of insertedStudents) {
    const [enrollment] = await db.select().from(schema.enrollments).where(eq(schema.enrollments.studentId, student.id));
    if (enrollment) {
      // Inscription
      await db.insert(schema.payments).values({
        studentId: student.id,
        enrollmentId: enrollment.id,
        category: 'inscription',
        amount: 750000,
        paidAmount: Math.random() > 0.5 ? 750000 : 300000,
        date: new Date().toISOString().split('T')[0],
        status: Math.random() > 0.5 ? 'paye' : 'partiel',
      });
    }
  }

  console.log('✅ Payments created');
  console.log('🚀 Seeding finished successfully!');
}

seed().catch(console.error);
