/**
 * Drizzle ORM Schema for CFAZ - Neon PostgreSQL
 */
import { pgTable, serial, varchar, text, integer, timestamp, real, pgEnum } from 'drizzle-orm/pg-core';

// ─── Enums ────────────────────────────────────────────────
export const roleEnum = pgEnum('role', ['admin', 'coach', 'parent']);
export const sexEnum = pgEnum('sex', ['M', 'F']);
export const parentRelationEnum = pgEnum('parent_relation', ['pere', 'mere', 'tuteur']);
export const enrollmentStatusEnum = pgEnum('enrollment_status', ['en_cours', 'complet', 'incomplet']);
export const paymentCategoryEnum = pgEnum('payment_category', ['inscription', 'trousse_sante', 'kit_sportif']);
export const paymentStatusEnum = pgEnum('payment_status', ['paye', 'partiel', 'impaye']);
export const paymentMethodEnum = pgEnum('payment_method', ['especes', 'virement', 'mobile_money']);
export const documentTypeEnum = pgEnum('document_type', [
  'acte_naissance',
  'carte_nationalite_enfant',
  'carte_nationalite_parent',
  'photo_enfant',
  'bulletins_scolaires',
  'certificat_medical',
  'autorisation_parentale',
]);

// ─── Users ────────────────────────────────────────────────
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  role: roleEnum('role').notNull().default('admin'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── Students ─────────────────────────────────────────────
export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  // Info personnelles
  fullName: varchar('full_name', { length: 255 }).notNull(),
  dateOfBirth: varchar('date_of_birth', { length: 20 }).notNull(),
  placeOfBirth: varchar('place_of_birth', { length: 255 }).notNull(),
  nationality: varchar('nationality', { length: 100 }).notNull().default('Camerounaise'),
  sex: sexEnum('sex').notNull(),
  address: varchar('address', { length: 500 }),
  city: varchar('city', { length: 100 }),
  region: varchar('region', { length: 100 }),
  phone: varchar('phone', { length: 30 }),
  photo: text('photo'), // base64

  // Parent/Tuteur
  parentName: varchar('parent_name', { length: 255 }),
  parentRelation: parentRelationEnum('parent_relation'),
  parentProfession: varchar('parent_profession', { length: 255 }),
  parentPhone: varchar('parent_phone', { length: 30 }),
  parentEmail: varchar('parent_email', { length: 255 }),
  emergencyContactName: varchar('emergency_contact_name', { length: 255 }),
  emergencyContactPhone: varchar('emergency_contact_phone', { length: 30 }),

  // Scolaire
  school: varchar('school', { length: 255 }),
  classLevel: varchar('class_level', { length: 50 }),
  academicYearSchool: varchar('academic_year_school', { length: 20 }),
  averageGrade: real('average_grade'),

  // Sportif
  currentClub: varchar('current_club', { length: 255 }),
  positions: text('positions'), // JSON string array
  yearsOfPractice: integer('years_of_practice'),
  otherSports: text('other_sports'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ─── Enrollments ──────────────────────────────────────────
export const enrollments = pgTable('enrollments', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  academicYear: varchar('academic_year', { length: 20 }).notNull(), // e.g. "2025-2026"
  status: enrollmentStatusEnum('status').notNull().default('en_cours'),
  category: varchar('category', { length: 10 }), // U13, U15, U17
  registrationStep: integer('registration_step').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ─── Documents ────────────────────────────────────────────
export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  enrollmentId: integer('enrollment_id').references(() => enrollments.id).notNull(),
  type: documentTypeEnum('type').notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileData: text('file_data').notNull(), // base64
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});

// ─── Payments ─────────────────────────────────────────────
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  enrollmentId: integer('enrollment_id').references(() => enrollments.id).notNull(),
  category: paymentCategoryEnum('category').notNull(),
  amount: integer('amount').notNull(), // Total due for this category
  paidAmount: integer('paid_amount').notNull().default(0),
  date: varchar('date', { length: 20 }).notNull(),
  method: paymentMethodEnum('method').notNull().default('especes'),
  note: text('note'),
  status: paymentStatusEnum('status').notNull().default('impaye'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
