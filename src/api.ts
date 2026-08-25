import type {
  DecisionRequest,
  ReviewSignal,
  Submission,
  SubmissionDetail,
  SubmissionFilters,
  SubmissionListResponse,
} from './types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ?? '';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function normalizeSubmission(value: unknown): Submission {
  const data = isRecord(value) ? value : {};
  const applicant = isRecord(data.applicant) ? data.applicant : {};
  const group = isRecord(data.group) ? data.group : {};
  return {
    id: text(data.id) || 'unknown-submission',
    applicant: { name: text(applicant.name), email: text(applicant.email) },
    group: { id: text(group.id), name: text(group.name) },
    product: text(data.product),
    coverageAmountCents: typeof data.coverageAmountCents === 'number' ? data.coverageAmountCents : Number.NaN,
    submittedAt: text(data.submittedAt), effectiveDate: text(data.effectiveDate),
    reviewReason: text(data.reviewReason), priority: text(data.priority), status: text(data.status),
  };
}

function normalizeSignals(value: unknown): ReviewSignal[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isRecord).map((signal) => ({ code: text(signal.code), message: text(signal.message), severity: text(signal.severity) }));
}

function normalizeDetail(value: unknown): SubmissionDetail {
  const data = isRecord(value) ? value : {};
  return {
    ...normalizeSubmission(data),
    employee: isRecord(data.employee) ? data.employee : undefined,
    employment: isRecord(data.employment) ? data.employment : undefined,
    election: isRecord(data.election) ? data.election : undefined,
    existingCoverage: isRecord(data.existingCoverage) ? data.existingCoverage : undefined,
    reviewSignals: normalizeSignals(data.reviewSignals),
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export async function getSubmissions(filters: SubmissionFilters): Promise<SubmissionListResponse> {
  const params = new URLSearchParams({
    query: filters.query,
    group: filters.group,
    reason: filters.reason,
    sort: filters.sort,
  });

  const response = await request<unknown>(`/api/submissions?${params.toString()}`);
  const data = isRecord(response) ? response : {};
  const items = Array.isArray(data.items) ? data.items.map(normalizeSubmission) : [];
  return { items, total: typeof data.total === 'number' ? data.total : items.length };
}

export async function getSubmission(id: string): Promise<SubmissionDetail> {
  return normalizeDetail(await request<unknown>(`/api/submissions/${encodeURIComponent(id)}`));
}

export async function recordDecision(id: string, body: DecisionRequest): Promise<SubmissionDetail> {
  const response = await request<unknown>(`/api/submissions/${encodeURIComponent(id)}/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return normalizeDetail(response);
}
