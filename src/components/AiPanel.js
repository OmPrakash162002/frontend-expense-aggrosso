import { VerdictBadge, UncertainBadge } from './Badges';
import PolicyEvidence from './PolicyEvidence';
import { categoryLabel } from '@/lib/format';

export default function AiPanel({ claim, policyById, onReanalyse, busy }) {
  const ai = claim.ai;
  if (!ai) return null;
  const mismatch = claim.category !== 'other' && ai.category !== claim.category && !ai.uncertain;
  return (
    <section className="card">
      <div className="row spread">
        <h2 style={{ margin: 0 }}>AI analysis</h2>
        <span className="badge neutral">{ai.source === 'claude' ? `Claude · ${ai.model}` : 'Rules-based fallback'}</span>
      </div>
      {ai.error && <div className="alert warn" style={{ marginTop: '.6rem' }}>{ai.error}</div>}

      <dl className="kv" style={{ margin: '.8rem 0' }}>
        <dt>Claimed category</dt><dd>{categoryLabel(claim.category)}</dd>
        <dt>AI classification</dt>
        <dd>{categoryLabel(ai.category) || 'Unclassified'} <span className="muted">({Math.round(ai.confidence * 100)}% confidence)</span> {ai.uncertain && <UncertainBadge />}</dd>
        <dt>Category used</dt>
        <dd>
          {categoryLabel(claim.effectiveCategory) || 'Unclassified'}{' '}
          {claim.override ? <span className="badge info">Reviewer override</span> : claim.category === 'other' && ai.uncertain ? <span className="badge bad">Not settled</span> : null}
        </dd>
        <dt>Assessment</dt><dd><VerdictBadge verdict={ai.verdict} /></dd>
      </dl>
      {mismatch && <div className="alert warn">The AI would classify this as <strong>{categoryLabel(ai.category)}</strong>, not the claimed <strong>{categoryLabel(claim.category)}</strong>. Check the description.</div>}
      {ai.uncertain && <div className="alert warn">The classification is uncertain. Confirm the category or override it before deciding.</div>}
      {claim.override && <p className="small muted">Override by {claim.override.by}: “{claim.override.reason}”</p>}

      {ai.summary && <p>{ai.summary}</p>}
      <h3>Findings</h3>
      {ai.findings.length === 0 && <p className="muted small">No findings.</p>}
      {ai.findings.map((f, i) => (
        <div className="finding" key={i}><div>{f.statement}</div><PolicyEvidence ids={f.policyIds} policyById={policyById} /></div>
      ))}

      {ai.questions?.length > 0 && (<>
        <h3 style={{ marginTop: '.9rem' }}>Missing information</h3>
        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>{ai.questions.map((q, i) => <li key={i}>{q}</li>)}</ul>
      </>)}

      <details className="evidence" style={{ marginTop: '.9rem' }}>
        <summary>Policy sections the AI was given ({ai.retrieved?.length || 0})</summary>
        <p>{(ai.retrieved || []).map((r) => `${r.id} (${r.reason})`).join(', ')}</p>
      </details>
      {onReanalyse && <div style={{ marginTop: '.8rem' }}><button onClick={onReanalyse} disabled={busy}>Re-run analysis</button></div>}
    </section>
  );
}
