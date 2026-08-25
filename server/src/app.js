import cors from 'cors';
import express from 'express';
import { seedSubmissions } from './data.js';

const priorityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
const delay = () => new Promise((resolve) => setTimeout(resolve, 150 + Math.floor(Math.random() * 450)));
const clone = (value) => JSON.parse(JSON.stringify(value));

export function createApp({ shouldFailDecision = () => Math.random() < 0.2 } = {}) {
  const app = express();
  const submissions = clone(seedSubmissions);
  app.use(cors());
  app.use(express.json());

  app.get('/api/submissions', async (request, response) => {
    await delay();
    const query = String(request.query.query ?? '').trim().toLowerCase();
    const group = String(request.query.group ?? '');
    const reason = String(request.query.reason ?? '');
    const sort = String(request.query.sort ?? 'priority_desc');
    let items = submissions.filter((item) => item.status === 'NEEDS_REVIEW');
    if (query) items = items.filter((item) => `${item.applicant.name} ${item.applicant.email}`.toLowerCase().includes(query));
    if (group) items = items.filter((item) => item.group.id === group);
    if (reason) items = items.filter((item) => item.reviewReason === reason);
    items.sort((left, right) => {
      if (sort === 'applicant_asc') return left.applicant.name.localeCompare(right.applicant.name);
      if (sort === 'submitted_asc') return left.submittedAt.localeCompare(right.submittedAt);
      if (sort === 'submitted_desc') return right.submittedAt.localeCompare(left.submittedAt);
      return priorityWeight[right.priority] - priorityWeight[left.priority] || right.submittedAt.localeCompare(left.submittedAt);
    });
    response.json({ items: items.map(({ employee, employment, election, existingCoverage, reviewSignals, ...queueItem }) => queueItem), total: items.length });
  });

  app.get('/api/submissions/:id', async (request, response) => {
    await delay();
    const item = submissions.find((submission) => submission.id === request.params.id);
    if (!item) return response.status(404).json({ message: 'Submission not found.' });
    return response.json(item);
  });

  app.post('/api/submissions/:id/decision', async (request, response) => {
    await delay();
    const item = submissions.find((submission) => submission.id === request.params.id);
    if (!item) return response.status(404).json({ message: 'Submission not found.' });
    const { decision, note } = request.body ?? {};
    if (!['APPROVE', 'RETURN'].includes(decision)) return response.status(400).json({ message: 'A valid decision is required.' });
    if (decision === 'RETURN' && (typeof note !== 'string' || !note.trim())) return response.status(400).json({ message: 'A correction note is required when returning a submission.' });
    if (shouldFailDecision()) return response.status(503).json({ message: 'Temporary service error. Please retry.' });
    item.status = decision === 'APPROVE' ? 'APPROVED' : 'RETURNED_FOR_CORRECTION';
    item.decisionNote = decision === 'RETURN' ? note.trim() : undefined;
    return response.json(item);
  });

  return app;
}
