const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function fetcher<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  auth: {
    login: (email: string, password?: string) =>
      fetcher("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    logout: () => fetcher("/auth/logout", { method: "POST" }),
    me: () => fetcher("/auth/me"),
  },
  patients: {
    getAll: (q?: string) => fetcher(`/patients${q ? `?q=${encodeURIComponent(q)}` : ""}`),
    getById: (id: string) => fetcher(`/patients/${id}`),
    create: (data: any) =>
      fetcher("/patients", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  appointments: {
    getByDate: (date?: string) =>
      fetcher(`/appointments${date ? `?date=${encodeURIComponent(date)}` : ""}`),
    create: (data: {
      patientId: string;
      dateTime: string;
      durationMinutes?: number;
      reason?: string;
    }) =>
      fetcher("/appointments", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateStatus: (id: string, status: string) =>
      fetcher(`/appointments/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
  },
  records: {
    getAll: () => fetcher<any[]>("/records"),
    getNotes: (patientId: string) => fetcher<any[]>(`/patients/${patientId}/notes`),
    createNote: (
      patientId: string,
      data: { chiefComplaint?: string; clinicalNotes: string; treatment?: string },
    ) =>
      fetcher(`/patients/${patientId}/notes`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  documents: {
    getAll: () => fetcher<any[]>("/documents"),
    getPresignedUrl: (patientId: string, filename: string, mimeType: string) =>
      fetcher<{ uploadUrl: string; storageKey: string }>(`/patients/${patientId}/documents/presigned-url`, {
        method: "POST",
        body: JSON.stringify({ filename, mimeType }),
      }),
    saveMetadata: (patientId: string, data: any) =>
      fetcher(`/patients/${patientId}/documents`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getByPatient: (patientId: string) =>
      fetcher<any[]>(`/patients/${patientId}/documents`),
  },
  cora: {
    chat: (message: string, patientContextId?: string) =>
      fetcher("/api/cora/chat", {
        method: "POST",
        body: JSON.stringify({ message, patientContextId }),
      }),
  },
  whatsapp: {
    getStatus: () => fetcher("/admin/whatsapp/status"),
  },
};
