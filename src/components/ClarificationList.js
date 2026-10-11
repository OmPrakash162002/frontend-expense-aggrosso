'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { formatDateTime } from '@/lib/format';

function AnswerForm({ claimId, item, onChange }) {
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try { await api.answerClarification(claimId, item._id, answer); await onChange(); }
    catch (err) { setError(err.message); setBusy(false); }
  }
  return (
    <form onSubmit={submit}>
      {error && <div className="alert bad">{error}</div>}
      <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Claimant’s answer" aria-label="Answer" />
      <button className="primary" disabled={busy || !answer.trim()} style={{ marginTop: '.4rem' }}>{busy ? 'Saving…' : 'Record answer'}</button>
    </form>
  );
}

export default function ClarificationList({ claim, canAnswer, onChange }) {
  if (!claim.clarifications.length) return null;
  const open = !['approved', 'rejected'].includes(claim.status);
  return (
    <section className="card">
      <h2>Clarifications</h2>
      {claim.clarifications.map((c) => (
        <div className="finding" key={c._id}>
          <div><strong>Q:</strong> {c.question} <span className="muted small">({c.askedBy}, {formatDateTime(c.askedAt)})</span></div>
          {c.answer ? <div style={{ marginTop: '.3rem' }}><strong>A:</strong> {c.answer} <span className="muted small">({c.answeredBy}, {formatDateTime(c.answeredAt)})</span></div>
            : open && canAnswer ? <div style={{ marginTop: '.4rem' }}><AnswerForm claimId={claim._id} item={c} onChange={onChange} /></div>
            : <div className="muted small">{open ? 'Waiting for the claimant to answer.' : 'No answer.'}</div>}
        </div>
      ))}
    </section>
  );
}
