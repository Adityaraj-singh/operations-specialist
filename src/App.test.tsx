import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as api from './api';
import App from './App';
import type { SubmissionDetail } from './types';

jest.mock('./api');

const submission: SubmissionDetail = {
  id: 'sub_1042', applicant: { name: 'Alex Morgan', email: 'alex@example.com' },
  group: { id: 'grp_northstar', name: 'Northstar Fabrication' }, product: 'Voluntary Life',
  coverageAmountCents: 25000000, submittedAt: '2026-11-01T08:30:00-05:00', effectiveDate: '2027-01-01',
  reviewReason: 'COVERAGE_MISMATCH', priority: 'HIGH', status: 'NEEDS_REVIEW',
  employee: { dateOfBirth: '1990-06-05' }, reviewSignals: [{ code: 'MISMATCH', message: 'Requested coverage differs from existing coverage.', severity: 'WARNING' }],
};

const getSubmissions = api.getSubmissions as jest.MockedFunction<typeof api.getSubmissions>;
const getSubmission = api.getSubmission as jest.MockedFunction<typeof api.getSubmission>;
const recordDecision = api.recordDecision as jest.MockedFunction<typeof api.recordDecision>;

beforeEach(() => {
  getSubmissions.mockResolvedValue({ items: [submission], total: 1 });
  getSubmission.mockResolvedValue(submission);
  recordDecision.mockResolvedValue({ ...submission, status: 'RETURNED_FOR_CORRECTION' });
});

afterEach(() => jest.clearAllMocks());

test('uses priority ordering by default and shows the selected submission details', async () => {
  render(<App />);
  await screen.findByText('Alex Morgan');
  expect(getSubmissions).toHaveBeenCalledWith(expect.objectContaining({ sort: 'priority_desc' }));
  fireEvent.click(screen.getByRole('button', { name: /alex morgan/i }));
  expect(await screen.findByText('Requested coverage differs from existing coverage.')).toBeInTheDocument();
});

test('requires a correction note and sends exactly one return decision after it is entered', async () => {
  render(<App />);
  fireEvent.click(await screen.findByRole('button', { name: /alex morgan/i }));
  await screen.findByText('Record decision');
  fireEvent.click(screen.getByRole('button', { name: 'Return for correction' }));
  expect(screen.getByRole('button', { name: 'Return for correction' })).toBeDisabled();
  fireEvent.change(screen.getByLabelText(/correction note/i), { target: { value: 'Please confirm your current coverage.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Return for correction' }));
  await waitFor(() => expect(recordDecision).toHaveBeenCalledWith('sub_1042', { decision: 'RETURN', note: 'Please confirm your current coverage.' }));
  expect(recordDecision).toHaveBeenCalledTimes(1);
});
