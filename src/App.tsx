import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react';
import { getSubmission, getSubmissions, recordDecision } from './api';
import { FilterBar } from './components/FilterBar';
import { ReviewQueue } from './components/ReviewQueue';
import { SubmissionDetails } from './components/SubmissionDetails';
import { useDebouncedValue } from './hooks/useDebouncedValue';
import type { Decision, Submission, SubmissionDetail, SubmissionFilters } from './types';
import './App.css';

const defaultFilters: SubmissionFilters = { query: '', group: '', reason: '', sort: 'priority_desc' };

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function App(): ReactElement {
  const [filters, setFilters] = useState<SubmissionFilters>(defaultFilters);
  const debouncedQuery = useDebouncedValue(filters.query);
  const requestFilters = useMemo(() => ({ ...filters, query: debouncedQuery }), [debouncedQuery, filters]);
  const [items, setItems] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [queueLoading, setQueueLoading] = useState(true);
  const [queueError, setQueueError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<SubmissionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [queueRefresh, setQueueRefresh] = useState(0);
  const refreshQueue = useCallback(() => setQueueRefresh((value) => value + 1), []);

  useEffect(() => {
    let active = true;
    setQueueLoading(true); setQueueError(null);
    getSubmissions(requestFilters).then((response) => {
      if (!active) return;
      setItems(Array.isArray(response.items) ? response.items : []);
      setTotal(typeof response.total === 'number' ? response.total : 0);
    }).catch((error: unknown) => { if (active) setQueueError(errorMessage(error, 'Unable to load submissions.')); })
      .finally(() => { if (active) setQueueLoading(false); });
    return () => { active = false; };
  }, [queueRefresh, requestFilters]);

  useEffect(() => {
    if (!selectedId) { setDetail(null); setDetailError(null); return; }
    let active = true;
    setDetailLoading(true); setDetailError(null);
    getSubmission(selectedId).then((response) => { if (active) setDetail(response); })
      .catch((error: unknown) => { if (active) setDetailError(errorMessage(error, 'Unable to load submission details.')); })
      .finally(() => { if (active) setDetailLoading(false); });
    return () => { active = false; };
  }, [selectedId]);

  async function handleDecision(decision: Decision, note?: string): Promise<void> {
    if (!selectedId || saving || (decision === 'RETURN' && !note)) return;
    setSaving(true); setSaveError(null);
    try {
      const updated = await recordDecision(selectedId, { decision, note });
      setDetail(updated);
      setAnnouncement(decision === 'APPROVE' ? 'Submission approved.' : 'Submission returned for correction.');
      refreshQueue();
    } catch (error) { setSaveError(errorMessage(error, 'The decision was not saved. Try again.')); }
    finally { setSaving(false); }
  }

  function handleSelection(id: string): void { setSelectedId(id); setSaveError(null); }
  function retryDetail(): void { if (selectedId) { setSelectedId(null); window.setTimeout(() => setSelectedId(selectedId), 0); } }

  return (
    <main className="app-shell">
      <div className="sr-only" aria-live="polite">{announcement}</div>
      <header className="page-header"><div><h1>Enrollment Review Workbench</h1><p>Prioritize, inspect, and resolve enrollment exceptions.</p></div></header>
      <FilterBar filters={filters} submissions={items} onChange={setFilters} onClear={() => setFilters(defaultFilters)} />
      <div className="workbench-layout">
        <ReviewQueue items={items} total={total} selectedId={selectedId} isLoading={queueLoading} error={queueError} onSelect={handleSelection} onRetry={refreshQueue} onClearFilters={() => setFilters(defaultFilters)} />
        <SubmissionDetails detail={detail} isLoading={detailLoading} error={detailError} isSaving={saving} saveError={saveError} onRetry={retryDetail} onDecision={handleDecision} />
      </div>
    </main>
  );
}

export default App;
