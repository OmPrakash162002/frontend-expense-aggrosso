import { formatMoney, categoryLabel, STATUS_LABEL } from '@/lib/format';

function Mini({ title, data, label = (k) => k }) {
  const rows = Object.entries(data || {}).sort((a, b) => b[1].totalBase - a[1].totalBase);
  return (
    <div className="card">
      <h3>{title}</h3>
      {rows.length === 0 ? <p className="muted small">No data yet.</p> : (
        <table>
          <tbody>
            {rows.map(([k, v]) => (
              <tr key={k}><td>{label(k)} <span className="muted small">({v.count})</span></td><td className="num mono">{formatMoney(v.totalBase)}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function TotalsBar({ totals }) {
  if (!totals) return null;
  return (
    <>
      <div className="card row spread">
        <div><div className="muted small">Total claimed (excluding rejected)</div><div className="stat mono">{formatMoney(totals.grandTotalBase)}</div></div>
        <div><div className="muted small">Claims</div><div className="stat">{totals.count}</div></div>
        <div><div className="muted small">Awaiting review</div><div className="stat">{(totals.byStatus.pending_review?.count || 0) + (totals.byStatus.needs_clarification?.count || 0)}</div></div>
      </div>
      <div className="grid3">
        <Mini title="By status" data={totals.byStatus} label={(k) => STATUS_LABEL[k] || k} />
        <Mini title="By category" data={totals.byCategory} label={categoryLabel} />
        <Mini title="By claimant" data={totals.byClaimant} />
      </div>
    </>
  );
}
