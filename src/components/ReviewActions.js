'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import DecisionCard from './DecisionCard';

const MODES = [
  { key: 'approve', label: 'Approve', cls: 'approve' },
  { key: 'reject', label: 'Reject', cls: 'reject' },
  { key: 'clarify', label: 'Request clarification' },
  { key: 'override', label: 'Override classification' },
];

export default function ReviewActions({ claim, categories, onChange }) {
  const [mode, setMode] = useState(null);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (['approved', 'rejected'].includes(claim.status)) return <DecisionCard claim={claim} />;

  const hasErrors = claim.validation?.issues?.some((i) => i.severity === 'error');
  const openClarifications = claim.clarifications.some((c) => !c.answer);
  const pick = (k) => { setMode(k === mode ? null : k); setText(''); setError(''); setCategory(categories.some((c) => c.key === claim.effectiveCategory) ? claim.effectiveCategory : ''); };

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      if (mode === 'approve') await api.approve(claim._id, text);
      if (mode === 'reject') await api.reject(claim._id, text);
      if (mode === 'clarify') await api.requestClarification(claim._id, text);
      if (mode === 'override') await api.override(claim._id, category, text);
      setMode(null); setText('');
      await onChange();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const label = { approve: hasErrors ? 'Justification (required: this claim has policy issues)' : 'Note (optional)', reject: 'Reason for rejection', clarify: 'Question for the claimant', override: 'Reason for the override' }[mode];

  return (
    <section className="card">
      <h2>Review actions</h2>
      <div className="tabs">
        {MODES.map((m) => <button key={m.key} className={mode === m.key ? m.cls : ''} aria-pressed={mode === m.key} onClick={() => pick(m.key)}>{m.label}</button>)}
      </div>
      {mode === 'approve' && openClarifications && <div className="alert warn">There are unanswered clarification requests. Resolve them before approving.</div>}
      {mode && (
        <form onSubmit={submit}>
          {error && <div className="alert bad">{error}</div>}
          {mode === 'override' && (
            <div className="field"><label htmlFor="ov">Correct category</label>
              <select id="ov" value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="" disabled>Select a category</option>
                {categories.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select></div>
          )}
          {mode === 'clarify' && claim.ai?.questions?.length > 0 && (
            <div className="field"><div className="small muted" style={{ marginBottom: '.3rem' }}>Suggested by the assistant (click to use):</div>
              <div className="chips">{claim.ai.questions.map((q, i) => <button type="button" className="chip clickable" key={i} onClick={() => setText(q)}>{q}</button>)}</div></div>
          )}
          <div className="field"><label htmlFor="txt">{label}</label><textarea id="txt" value={text} onChange={(e) => setText(e.target.value)} /></div>
          <button className={mode === 'approve' ? 'approve' : mode === 'reject' ? 'reject' : 'primary'} disabled={busy || (mode === 'override' && !category)}>
            {busy ? 'Saving…' : { approve: 'Confirm approval', reject: 'Confirm rejection', clarify: 'Send request', override: 'Save override' }[mode]}
          </button>
        </form>
      )}
      {!mode && <p className="muted small" style={{ margin: 0 }}>Every action is recorded in the history with your name.</p>}
    </section>
  );
}
