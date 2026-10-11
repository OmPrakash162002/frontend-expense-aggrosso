import Link from 'next/link';
import { SeverityBadge } from './Badges';
import PolicyEvidence from './PolicyEvidence';
import { formatMoney, categoryLabel } from '@/lib/format';

export default function ValidationPanel({ claim, policy, policyById }) {
  const v = claim.validation || { issues: [], duplicates: [] };
  const cfg = policy?.categories.find((c) => c.key === claim.effectiveCategory);
  return (
    <section className="card">
      <h2>Automatic checks</h2>
      <p className="muted small" style={{ marginTop: 0 }}>Computed by code, not AI. These results always take priority over the AI’s opinion.</p>
      {v.issues.length === 0 ? <div className="alert info">No issues found: required fields, dates, receipt, limits and duplicates all pass.</div> : (
        v.issues.map((i, n) => (
          <div className="issue" key={n}>
            <div><SeverityBadge severity={i.severity} /></div>
            <div><div>{i.message}</div><PolicyEvidence ids={i.policyIds} policyById={policyById} /></div>
          </div>
        ))
      )}
      {v.duplicates?.length > 0 && (
        <p className="small">Related claims: {v.duplicates.map((d) => <span key={d.claimId}><Link href={`/claims/${d.claimId}`}>…{d.claimId.slice(-6)}</Link> ({d.type}) </span>)}</p>
      )}
      <dl className="kv" style={{ marginTop: '.8rem' }}>
        <dt>Amount in INR</dt><dd className="mono">{formatMoney(claim.amountBase)}</dd>
        {cfg && (<>
          <dt>Per-claim limit</dt><dd className="mono">{formatMoney(cfg.perClaimLimit)} ({categoryLabel(cfg.key)})</dd>
          <dt>Monthly total</dt><dd className="mono">{formatMoney(v.monthlyTotalBase)} of {formatMoney(cfg.monthlyLimit)}</dd>
        </>)}
      </dl>
    </section>
  );
}
