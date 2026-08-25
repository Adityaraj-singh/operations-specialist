export type ReviewReason =
  | 'COVERAGE_MISMATCH'
  | 'MISSING_INFORMATION'
  | 'CONFLICTING_INFORMATION'
  | 'ELIGIBILITY_REVIEW'
  | string;

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW' | string;
export type SubmissionStatus =
  | 'NEEDS_REVIEW'
  | 'APPROVED'
  | 'RETURNED_FOR_CORRECTION'
  | string;
export type SubmissionSort =
  | 'priority_desc'
  | 'submitted_desc'
  | 'submitted_asc'
  | 'applicant_asc';
export type Decision = 'APPROVE' | 'RETURN';

export interface Applicant {
  name: string;
  email: string;
}

export interface EmployerGroup {
  id: string;
  name: string;
}

export interface Submission {
  id: string;
  applicant: Applicant;
  group: EmployerGroup;
  product: string;
  coverageAmountCents: number;
  submittedAt: string;
  effectiveDate: string;
  reviewReason: ReviewReason;
  priority: Priority;
  status: SubmissionStatus;
}

export interface SubmissionListResponse {
  items: Submission[];
  total: number;
}

export interface ReviewSignal {
  code: string;
  message: string;
  severity?: 'INFO' | 'WARNING' | 'ERROR' | string;
}

/** Detail-only fields vary by submission, so absent values must be handled by the UI. */
export interface SubmissionDetail extends Submission {
  employee?: Record<string, unknown>;
  employment?: Record<string, unknown>;
  election?: Record<string, unknown>;
  existingCoverage?: Record<string, unknown>;
  reviewSignals?: ReviewSignal[];
}

export interface SubmissionFilters {
  query: string;
  group: string;
  reason: string;
  sort: SubmissionSort;
}

export interface DecisionRequest {
  decision: Decision;
  note?: string;
}
