import { useEffect, useRef, useState, type ReactElement } from 'react';
import type { Decision, SubmissionDetail } from '../types';
import { displayValue, formatCurrency, formatDate, formatLabel } from '../utils/format';

interface SubmissionDetailsProps {
  detail: SubmissionDetail | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  saveError: string | null;
  onRetry: () => void;
  onDecision: (decision: Decision, note?: string) => void;
}

function DetailSection({ title, data }: { title: string; data: Record<string, unknown> | undefined }): ReactElement | null {
  if (!data || Object.keys(data).length === 0) return null;
  return <section className="detail-section"><h3>{title}</h3><dl>{Object.entries(data).map(([key, value]) => <div key={key}><dt>{formatLabel(key)}</dt><dd>{displayValue(value)}</dd></div>)}</dl></section>;
}

export function SubmissionDetails(props: SubmissionDetailsProps): ReactElement {
  const { detail, isLoading, error, isSaving, saveError, onRetry, onDecision } = props;
  const [isReturning, setIsReturning] = useState(false);
  const [note, setNote] = useState('');
  const noteRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setIsReturning(false); setNote(''); }, [detail?.id]);
  useEffect(() => { if (isReturning) noteRef.current?.focus(); }, [isReturning]);

  if (isLoading) return <aside className="details-panel" aria-label="Submission details" aria-busy="true"><p role="status">Loading submission details…</p></aside>;
  if (error) return <aside className="details-panel" aria-label="Submission details"><div className="queue-message error-state" role="alert"><p>We could not load this submission.</p><button onClick={onRetry}>Try again</button></div></aside>;
  if (!detail) return <aside className="details-panel empty-details" aria-label="Submission details"><h2>Select a submission</h2><p>Choose an applicant from the queue to inspect their enrollment and record a decision.</p></aside>;

  const signals = detail.reviewSignals ?? [];
  const hasNote = note.trim().length > 0;
  return (
    <aside className="details-panel" aria-label={`Submission details for ${detail.applicant.name}`}>
      <header className="details-heading"><div><p className="eyebrow">Enrollment review</p><h2>{detail.applicant.name || 'Unnamed applicant'}</h2><a href={`mailto:${detail.applicant.email}`}>{detail.applicant.email || 'Email not provided'}</a></div><span className="status-badge">{formatLabel(detail.status)}</span></header>
      <section className="attention-section"><h3>Needs attention</h3>{signals.length ? <ul>{signals.map((signal) => <li key={`${signal.code}-${signal.message}`}><strong>{formatLabel(signal.severity ?? 'warning')}:</strong> {signal.message || formatLabel(signal.code)}</li>)}</ul> : <p>{formatLabel(detail.reviewReason)}</p>}</section>
      <section className="detail-section"><h3>Enrollment</h3><dl><div><dt>Employer group</dt><dd>{detail.group.name || 'Not provided'}</dd></div><div><dt>Product</dt><dd>{detail.product || 'Not provided'}</dd></div><div><dt>Requested coverage</dt><dd>{formatCurrency(detail.coverageAmountCents)}</dd></div><div><dt>Effective date</dt><dd>{formatDate(detail.effectiveDate)}</dd></div></dl></section>
      <DetailSection title="Employee" data={detail.employee} />
      <DetailSection title="Employment" data={detail.employment} />
      <DetailSection title="Election" data={detail.election} />
      <DetailSection title="Existing coverage" data={detail.existingCoverage} />
      <section className="decision-section" aria-label="Review decision">
        <h3>Record decision</h3>
        {saveError && <p className="inline-error" role="alert">{saveError} Your draft note has been kept.</p>}
        {isReturning && <label className="return-note"><span>Correction note <strong>(required)</strong></span><textarea ref={noteRef} value={note} onChange={(event) => setNote(event.target.value)} disabled={isSaving} rows={4} placeholder="Explain what the applicant needs to correct." /></label>}
        <div className="action-row">
          <button className="secondary-button" disabled={isSaving} onClick={() => { setIsReturning(false); onDecision('APPROVE'); }}>Approve</button>
          {isReturning ? <button className="danger-button" disabled={isSaving || !hasNote} onClick={() => onDecision('RETURN', note.trim())}>{isSaving ? 'Saving…' : 'Return for correction'}</button> : <button className="danger-button" disabled={isSaving} onClick={() => setIsReturning(true)}>Return for correction</button>}
        </div>
      </section>
    </aside>
  );
}
