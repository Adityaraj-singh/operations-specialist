import type { ReactElement } from 'react';
import type { Submission } from '../types';
import { formatCurrency, formatDateTime, formatLabel } from '../utils/format';

interface ReviewQueueProps {
  items: Submission[];
  total: number;
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;
  onSelect: (id: string) => void;
  onRetry: () => void;
  onClearFilters: () => void;
}

function QueueLoader(): ReactElement {
  return (
    <div className="queue-loader" role="status" aria-live="polite" aria-label="Loading review queue">
      <span className="queue-loader__label">Loading queue</span>
      <div className="queue-loader__track" aria-hidden="true"><span className="queue-loader__bar" /></div>
      <span className="queue-loader__message">Finding submissions that need review…</span>
    </div>
  );
}

function QueueRefreshIndicator(): ReactElement {
  return (
    <span className="queue-refresh" role="status" aria-live="polite">
      <span className="queue-refresh__gear" aria-hidden="true">⚙</span>
      Updating queue…
    </span>
  );
}

export function ReviewQueue(props: ReviewQueueProps): ReactElement {
  const { items, total, selectedId, isLoading, error, onSelect, onRetry, onClearFilters } = props;

  if (isLoading && items.length === 0) return <div className="queue-message"><QueueLoader /></div>;
  if (error && items.length === 0) {
    return <div className="queue-message error-state" role="alert"><p>We could not load the review queue.</p><button onClick={onRetry}>Try again</button></div>;
  }
  if (!items.length) {
    return <div className="queue-message"><h2>No submissions found</h2><p>Try changing or clearing your filters.</p><button className="secondary-button" onClick={onClearFilters}>Clear filters</button></div>;
  }

  return (
    <section className="queue-panel" aria-label="Review queue" aria-busy={isLoading}>
      <div className="queue-summary"><strong>{total} submission{total === 1 ? '' : 's'}</strong>{isLoading && <QueueRefreshIndicator />}{error && <span className="inline-error" role="alert">Could not refresh. <button onClick={onRetry}>Retry</button></span>}</div>
      <div className="queue-table-wrap">
        <table>
          <thead><tr><th>Applicant</th><th>Enrollment</th><th>Submitted</th><th>Reason</th><th>Status</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className={selectedId === item.id ? 'is-selected' : undefined}>
                <td><button className="row-button" onClick={() => onSelect(item.id)} aria-pressed={selectedId === item.id}><strong>{item.applicant.name || 'Unnamed applicant'}</strong><span>{item.applicant.email || 'Email not provided'}</span></button></td>
                <td><span>{item.group.name || 'Group not provided'}</span><span>{item.product || 'Product not provided'} · {formatCurrency(item.coverageAmountCents)}</span></td>
                <td>{formatDateTime(item.submittedAt)}</td>
                <td><span className={`priority priority-${item.priority.toLowerCase()}`}>{formatLabel(item.priority)} priority</span><span>{formatLabel(item.reviewReason)}</span></td>
                <td><span className="status-badge">{formatLabel(item.status)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
