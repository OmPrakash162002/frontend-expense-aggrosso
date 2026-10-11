import { formatDateTime } from '@/lib/format';

export default function DecisionCard({ claim }) {
  const d = claim.decision;
  return (
    <section className="card">
      <h2>Decision</h2>
      <p style={{ margin: 0 }}><strong>{claim.status === 'approved' ? 'Approved' : 'Rejected'}</strong> by {d?.by} on {formatDateTime(d?.at)}.</p>
      {d?.note && <p className="muted">“{d.note}”</p>}
    </section>
  );
}
