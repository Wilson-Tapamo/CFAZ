/**
 * Frontend API Client
 * Handles all communication with the Vercel serverless API
 */

const API_BASE = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Erreur serveur');
  }

  return data as T;
}

// ─── Auth ─────────────────────────────────────────────────
export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ user: any }>('/auth', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    seed: () =>
      request<{ message: string; seeded: boolean }>('/seed', { method: 'POST' }),
  },

  // ─── Students ───────────────────────────────────────────
  students: {
    list: (params?: { search?: string; academicYear?: string }) => {
      const query = new URLSearchParams();
      if (params?.search) query.set('search', params.search);
      if (params?.academicYear) query.set('academicYear', params.academicYear);
      const qs = query.toString();
      return request<{ students: any[]; total: number }>(`/students${qs ? `?${qs}` : ''}`);
    },

    get: (id: number) =>
      request<{ student: any; enrollments: any[] }>(`/students?id=${id}`),

    create: (data: any) =>
      request<{ student: any }>('/students', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: number, data: any) =>
      request<{ student: any }>(`/students?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // ─── Enrollments ────────────────────────────────────────
  enrollments: {
    list: (params?: { studentId?: number; academicYear?: string }) => {
      const query = new URLSearchParams();
      if (params?.studentId) query.set('studentId', String(params.studentId));
      if (params?.academicYear) query.set('academicYear', params.academicYear);
      return request<{ enrollments: any[]; total: number }>(`/enrollments?${query}`);
    },

    get: (id: number) =>
      request<{ enrollment: any }>(`/enrollments?id=${id}`),

    create: (data: { studentId: number; academicYear: string; category?: string }) =>
      request<{ enrollment: any }>('/enrollments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: number, data: any) =>
      request<{ enrollment: any }>(`/enrollments?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // ─── Payments ───────────────────────────────────────────
  payments: {
    list: (params: { studentId?: number; enrollmentId?: number }) => {
      const query = new URLSearchParams();
      if (params.studentId) query.set('studentId', String(params.studentId));
      if (params.enrollmentId) query.set('enrollmentId', String(params.enrollmentId));
      return request<{ payments: any[]; totals: any; total: number }>(`/payments?${query}`);
    },

    create: (data: {
      studentId: number;
      enrollmentId: number;
      category: string;
      paidAmount: number;
      method?: string;
      note?: string;
    }) =>
      request<{ payment: any; totalPaid: number; remaining: number }>('/payments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // ─── Documents ──────────────────────────────────────────
  documents: {
    list: (params: { studentId?: number; enrollmentId?: number }) => {
      const query = new URLSearchParams();
      if (params.studentId) query.set('studentId', String(params.studentId));
      if (params.enrollmentId) query.set('enrollmentId', String(params.enrollmentId));
      return request<{ documents: any[] }>(`/documents?${query}`);
    },

    upload: (data: {
      studentId: number;
      enrollmentId: number;
      type: string;
      fileName: string;
      fileData: string;
      mimeType: string;
    }) =>
      request<{ document: any }>('/documents', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    delete: (id: number) =>
      request<{ deleted: boolean }>(`/documents?id=${id}`, { method: 'DELETE' }),
  },
};

// ─── Helpers ──────────────────────────────────────────────
export function getCurrentAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  if (month >= 8) return `${year}-${year + 1}`;
  return `${year - 1}-${year}`;
}

export const FEE_STRUCTURE = {
  inscription: { label: 'Frais d\'Inscription', amount: 750000 },
  trousse_sante: { label: 'Trousse Santé', amount: 100000 },
  kit_sportif: { label: 'Kit Sportif', amount: 100000 },
} as const;

export const TOTAL_FEES = Object.values(FEE_STRUCTURE).reduce((sum, f) => sum + f.amount, 0);

export const REQUIRED_DOCUMENTS = [
  { type: 'acte_naissance', label: 'Acte de Naissance' },
  { type: 'carte_nationalite_enfant', label: 'Photocopie Carte de Nationalité (Enfant)' },
  { type: 'carte_nationalite_parent', label: 'Photocopie Carte de Nationalité (Parent)' },
  { type: 'photo_enfant', label: 'Photos Récentes de l\'Enfant' },
  { type: 'bulletins_scolaires', label: 'Bulletins Scolaires (Dernières Années)' },
  { type: 'certificat_medical', label: 'Certificat Médical de Non Contre-Indication' },
  { type: 'autorisation_parentale', label: 'Autorisation Parentale' },
] as const;

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

export function formatCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}
