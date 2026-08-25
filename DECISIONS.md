# Design decisions

## Product and UX

This workbench optimizes for an experienced operations specialist moving through a high-volume exception queue. The default server sort is `priority_desc`, so higher-risk records are visible before chronological ordering. The queue retains its position while a record is opened in a persistent detail panel; this avoids the disorienting page navigation that slows repeated reviews.

The requirements did not prescribe a layout or the meaning of priority. I treated priority as an API-owned ordering signal and displayed it as a written label as well as a visual badge. On narrow screens the detail panel follows the queue rather than becoming inaccessible. Review signals are placed above the raw enrollment information because they answer the specialist's first question: why is this record here?

The API can return incomplete records. The UI uses “Not provided” rather than blank space where a value cannot be displayed, and the API boundary normalizes malformed or omitted objects into safe values. This makes missing data visible without crashing the queue.

## Technical approach

React state is intentionally split by responsibility: filter and selected-record state are local UI state; list and detail responses are server state; labels and formatted values are derived at render time. `api.ts` is the only module that knows HTTP paths and response normalization. Components receive typed props and contain no fetch logic. `App.tsx` coordinates re-fetching and ensures the list is refreshed after a successful decision.

Search input is debounced by 300ms before it changes the API request. No data-fetching dependency was added: the small number of endpoints and interactions did not justify extra caching or abstraction. TypeScript was added because it was required by the task; its version is pinned to one compatible with the existing Create React App tooling. Because the supplied mock API was not present in the workspace, a small sibling Node/Express in-memory service implements the prescribed contract for local integration. It does not require a database and should be replaced by the supplied service if one becomes available.

## Reliability and edge cases

List and detail requests have distinct loading, error, retry, and empty states. An outdated async response cannot replace the current selection because effects ignore results after cleanup. A decision disables both actions while saving, preventing double POSTs. A failed return preserves the draft correction note, shows an error, and allows retry. On success, the open detail response is replaced with the server response and the queue is refreshed because the mock API is allowed to change list results.

The app does not implement pagination, offline queueing, optimistic updates, audit history, or authentication. Pagination needs an API contract beyond the supplied endpoint; the other items are deliberately outside the assignment’s scope.

## Accessibility

Native labels are used for all filters and the correction note. Queue records are buttons, so they can be selected by keyboard. Buttons and form fields have visible focus indicators. Loading and successful decisions use polite live announcements; errors use alert semantics. Status, priority, and signals are represented with words, not color alone. Semantic table, heading, list, and definition-list elements help convey the queue and details structure.

## AI usage

An AI coding assistant was used to turn the written requirements into a component structure, generate initial TypeScript types, and identify error and accessibility states. The generated code was reviewed and adjusted for the actual assignment constraints, including avoiding a separate backend, adding response normalization, and adding focused tests. The application was verified with a production build and local tests.

## With another day

I would add API-supported pagination, URL-persisted filters and selection, more realistic integration tests against the supplied mock service, and a compact keyboard shortcut for moving through the queue. I would also validate API data with a schema library if the service contract were less controlled or changed frequently.
