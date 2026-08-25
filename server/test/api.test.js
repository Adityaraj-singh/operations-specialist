import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createApp } from '../src/app.js';

let server;
let baseUrl;

before(async () => {
  server = createApp({ shouldFailDecision: () => false }).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test('lists reviewable submissions in priority order and honors applicant search', async () => {
  const response = await fetch(`${baseUrl}/api/submissions?sort=priority_desc`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.total, 4);
  assert.equal(body.items[0].id, 'sub_1042');
  assert.equal(body.items[0].employee, undefined);

  const filtered = await fetch(`${baseUrl}/api/submissions?query=marcus&sort=priority_desc`);
  const filteredBody = await filtered.json();
  assert.deepEqual(filteredBody.items.map((item) => item.id), ['sub_1044']);
});

test('requires a return note and removes successfully resolved submissions from the queue', async () => {
  const invalid = await fetch(`${baseUrl}/api/submissions/sub_1043/decision`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ decision: 'RETURN' }) });
  assert.equal(invalid.status, 400);

  const decision = await fetch(`${baseUrl}/api/submissions/sub_1043/decision`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ decision: 'RETURN', note: 'Please add your date of birth.' }) });
  const updated = await decision.json();
  assert.equal(updated.status, 'RETURNED_FOR_CORRECTION');

  const queue = await fetch(`${baseUrl}/api/submissions?query=priya&sort=priority_desc`);
  assert.equal((await queue.json()).total, 0);
});
