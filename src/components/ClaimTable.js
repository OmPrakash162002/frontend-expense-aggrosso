import Link from 'next/link';
import { StatusBadge, UncertainBadge } from './Badges';
import { formatDate, formatMoney, categoryLabel } from '@/lib/format';

export default function ClaimTable({ claims }) {
  if (!claims.length) return <p className="muted">No claims match. <Link href="/claims/new">Submit a claim</Link> or run <code>npm run seed</code> in the backend.</p>;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr><th>Date</th><th>Claimant</th><th>Category</th><th className="num">Amount</th><th>Flags</th><th>Status</th><th /></tr>
        </thead>
        <tbody>
          {claims.map((c) => {
            const issues = c.validation?.issues || [];
            const errors = issues.filter((i) => i.severity === 'error').length;
            const warnings = issues.length - errors;
            return (
              <tr key={c._id} className="link">
                <td>{formatDate(c.date)}</td>
                <td>{c.claimant}</td>
                <td>{categoryLabel(c.effectiveCategory)} {c.category === 'other' && c.ai?.uncertain && !c.override && <UncertainBadge />}</td>
                <td className="num mono">{formatMoney(c.amount, c.currency)}{c.currency !== 'INR' && <div className="muted small">{formatMoney(c.amountBase)}</div>}</td>
                <td>
                  {errors > 0 && <span className="badge bad">{errors} issue{errors > 1 ? 's' : ''}</span>} {warnings > 0 && <span className="badge warn">{warnings} warning{warnings > 1 ? 's' : ''}</span>}
                  {!issues.length && <span className="muted small">None</span>}
                </td>
                <td><StatusBadge status={c.status} /></td>
                <td><Link href={`/claims/${c._id}`}>Open</Link></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
