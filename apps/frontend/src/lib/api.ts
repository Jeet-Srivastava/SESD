const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

export type UserRole = 'STUDENT' | 'ADMIN' | 'STAFF';
export type ComplaintStatus =
  | 'CREATED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'ESCALATED';
export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AuthResponse {
  accessToken: string;
}

export interface ComplaintComment {
  message: string;
  createdAt: string;
  authorId?: {
    name?: string;
    role?: UserRole;
  };
}

export interface ComplaintRecord {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  createdAt: string;
  imageUrls: string[];
  escalationLevel: number;
  aiHints?: string;
  resolutionNote?: string;
  comments?: ComplaintComment[];
  authorId?: {
    _id?: string;
    name?: string;
    email?: string;
    role?: UserRole;
  };
  assigneeId?: {
    _id?: string;
    name?: string;
    email?: string;
    role?: UserRole;
  };
}

export interface UserSummary {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AnalyticsBreakdownItem {
  _id: string;
  count: number;
}

export interface ComplaintTrendItem {
  _id: string;
  count: number;
}

export interface StaffPerformanceItem {
  _id: string;
  name: string;
  email?: string | null;
  totalAssigned: number;
  resolvedCount: number;
  avgResolutionHours: number;
}

export interface AnalyticsOverview {
  totalComplaints: number;
  statusBreakdown: AnalyticsBreakdownItem[];
  priorityBreakdown: AnalyticsBreakdownItem[];
  avgResolutionHours: number;
  complaintTrends: ComplaintTrendItem[];
  staffPerformance: StaffPerformanceItem[];
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

interface ApiErrorPayload {
  message?: string;
  code?: string;
}

const buildHeaders = (token?: string, includeJson = false): HeadersInit => {
  const headers: Record<string, string> = {};

  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const parseJson = async <T>(response: Response): Promise<T> => {
  let payload: Partial<ApiEnvelope<T>> & {
    message?: string;
    error?: string | ApiErrorPayload;
  };

  try {
    payload = (await response.json()) as Partial<ApiEnvelope<T>> & {
      message?: string;
      error?: string | ApiErrorPayload;
    };
  } catch {
    throw new Error(response.ok ? 'Invalid API response' : 'API request failed');
  }

  const errorMessage =
    typeof payload.error === 'string' ? payload.error : payload.error?.message;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message ?? errorMessage ?? 'API request failed');
  }

  if (payload.data === undefined) {
    throw new Error('API response missing data');
  }

  return payload.data as T;
};

export const api = {
  register: async (input: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: buildHeaders(undefined, true),
      body: JSON.stringify(input),
    });
    return parseJson<AuthResponse>(response);
  },

  login: async (input: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: buildHeaders(undefined, true),
      body: JSON.stringify(input),
    });
    return parseJson<AuthResponse>(response);
  },

  getMyComplaints: async (token: string): Promise<ComplaintRecord[]> => {
    const response = await fetch(`${API_BASE_URL}/complaints`, {
      headers: buildHeaders(token),
    });
    return parseJson<ComplaintRecord[]>(response);
  },

  getAllComplaints: async (token: string): Promise<ComplaintRecord[]> => {
    const response = await fetch(`${API_BASE_URL}/complaints/all`, {
      headers: buildHeaders(token),
    });
    return parseJson<ComplaintRecord[]>(response);
  },

  getStaffUsers: async (token: string): Promise<UserSummary[]> => {
    const response = await fetch(`${API_BASE_URL}/users/staff`, {
      headers: buildHeaders(token),
    });
    return parseJson<UserSummary[]>(response);
  },

  getComplaintById: async (token: string, complaintId: string): Promise<ComplaintRecord> => {
    const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}`, {
      headers: buildHeaders(token),
    });
    return parseJson<ComplaintRecord>(response);
  },

  createComplaint: async (
    token: string,
    input: { title: string; description: string; imageUrls: string[] },
  ): Promise<ComplaintRecord> => {
    const response = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: buildHeaders(token, true),
      body: JSON.stringify(input),
    });
    return parseJson<ComplaintRecord>(response);
  },

  checkSimilarComplaints: async (
    token: string,
    input: { title: string; description: string },
  ): Promise<ComplaintRecord[]> => {
    const response = await fetch(`${API_BASE_URL}/complaints/check-similar`, {
      method: 'POST',
      headers: buildHeaders(token, true),
      body: JSON.stringify(input),
    });
    return parseJson<ComplaintRecord[]>(response);
  },

  addComment: async (
    token: string,
    complaintId: string,
    input: { message: string },
  ): Promise<ComplaintRecord> => {
    const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/comments`, {
      method: 'POST',
      headers: buildHeaders(token, true),
      body: JSON.stringify(input),
    });
    return parseJson<ComplaintRecord>(response);
  },

  updateComplaintStatus: async (
    token: string,
    complaintId: string,
    status: ComplaintStatus,
  ): Promise<ComplaintRecord> => {
    const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/status`, {
      method: 'PATCH',
      headers: buildHeaders(token, true),
      body: JSON.stringify({ status }),
    });
    return parseJson<ComplaintRecord>(response);
  },

  assignComplaint: async (
    token: string,
    complaintId: string,
    assigneeId: string,
  ): Promise<ComplaintRecord> => {
    const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/assign`, {
      method: 'PATCH',
      headers: buildHeaders(token, true),
      body: JSON.stringify({ assigneeId }),
    });
    return parseJson<ComplaintRecord>(response);
  },

  resolveComplaint: async (
    token: string,
    complaintId: string,
    note: string,
  ): Promise<ComplaintRecord> => {
    const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/resolve`, {
      method: 'PATCH',
      headers: buildHeaders(token, true),
      body: JSON.stringify({ note }),
    });
    return parseJson<ComplaintRecord>(response);
  },

  getAnalyticsOverview: async (token: string): Promise<AnalyticsOverview> => {
    const response = await fetch(`${API_BASE_URL}/analytics/overview`, {
      headers: buildHeaders(token),
    });
    return parseJson<AnalyticsOverview>(response);
  },

  uploadImage: async (token: string, image: string): Promise<{ url: string }> => {
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: buildHeaders(token, true),
      body: JSON.stringify({ image }),
    });
    return parseJson<{ url: string }>(response);
  },
};
