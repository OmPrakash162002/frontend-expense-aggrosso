import { formatDateTime, categoryLabel } from '@/lib/format';

const TITLES = {
  CLAIM_SUBMITTED: 'Claim submitted',
  AI_ANALYSED: 'AI analysis completed',
  REANALYSED: 'Analysis re-run',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CLARIFICATION_REQUESTED: 'Clarification requested',
  CLARIFICATION_ANSWERED: 'Clarification answered',
  CLASSIFICATION_OVERRIDDEN: 'Classification overridden',
};

function detail(h) {
  const d = h.details || {};
  switch (h.action) {
    case 'CLAIM_SUBMITTED': return `${d.amount} ${d.currency}, claimed as ${categoryLabel(d.category)}`;
    case 'AI_ANALYSED':
    case 'REANALYSED': return `${d.source === 'claude' ? 'Claude' : 'Rules fallback'}: ${categoryLabel(d.category) || 'unclassified'} (${Math.round((d.confidence || 0) * 100)}%${d.uncertain ? ', uncertain' : ''}), assessment: ${d.verdict}${d.issues?.length ? `, checks: ${d.issues.join(', ')}` : ''}`;
    case 'APPROVED':
    case 'REJECTED': return d.note ? `“${d.note}”` : '';
    case 'CLARIFICATION_REQUESTED': return `Q: ${d.question}`;
    case 'CLARIFICATION_ANSWERED': return `A: ${d.answer}`;
    case 'CLASSIFICATION_OVERRIDDEN': return `${categoryLabel(d.from) || 'Unclassified'} → ${categoryLabel(d.to)} (AI said ${categoryLabel(d.aiCategory) || 'n/a'}). Reason: ${d.reason}`;
    default: return '';
  }
}

export default function HistoryTimeline({ history }) {
  return (
    <section className="card">
      <h2>History</h2>
      <ol className="timeline">
        {history.map((h) => (
          <li key={h._id}>
            <strong>{TITLES[h.action] || h.action}</strong>
            <span className="muted small">{h.actor} · {formatDateTime(h.at)}</span>
            {detail(h) && <div className="small">{detail(h)}</div>}
          </li>
        ))}
      </ol>
    </section>
  );
}
