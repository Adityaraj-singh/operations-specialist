import type { ChangeEvent, ReactElement } from 'react';
import type { Submission, SubmissionFilters, SubmissionSort } from '../types';
import { formatLabel } from '../utils/format';

interface FilterBarProps {
  filters: SubmissionFilters;
  submissions: Submission[];
  onChange: (nextFilters: SubmissionFilters) => void;
  onClear: () => void;
}

const sortOptions: Array<{ value: SubmissionSort; label: string }> = [
  { value: 'priority_desc', label: 'Priority: high to low' },
  { value: 'submitted_desc', label: 'Submitted: newest first' },
  { value: 'submitted_asc', label: 'Submitted: oldest first' },
  { value: 'applicant_asc', label: 'Applicant: A to Z' },
];

export function FilterBar({ filters, submissions, onChange, onClear }: FilterBarProps): ReactElement {
  const groups = Array.from(new Map(submissions.map((item) => [item.group.id, item.group.name])).entries());
  const reasons = Array.from(new Set(submissions.map((item) => item.reviewReason).filter(Boolean)));
  const hasFilters = Boolean(filters.query || filters.group || filters.reason || filters.sort !== 'priority_desc');

  function update(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
    onChange({ ...filters, [event.target.name]: event.target.value });
  }

  return (
    <form className="filter-bar" onSubmit={(event) => event.preventDefault()} aria-label="Review queue filters">
      <label className="search-field">
        <span>Search applicants</span>
        <input name="query" type="search" value={filters.query} onChange={update} placeholder="Name or email" />
      </label>
      <label>
        <span>Employer group</span>
        <select name="group" value={filters.group} onChange={update}>
          <option value="">All groups</option>
          {groups.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
        </select>
      </label>
      <label>
        <span>Review reason</span>
        <select name="reason" value={filters.reason} onChange={update}>
          <option value="">All reasons</option>
          {reasons.map((reason) => <option key={reason} value={reason}>{formatLabel(reason)}</option>)}
        </select>
      </label>
      <label>
        <span>Sort by</span>
        <select name="sort" value={filters.sort} onChange={update}>
          {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
      {hasFilters && <button className="secondary-button clear-button" type="button" onClick={onClear}>Clear filters</button>}
    </form>
  );
}
