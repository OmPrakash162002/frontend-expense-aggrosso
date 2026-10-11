'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/format';

export default function PolicyPage() {
  const [policy, setPolicy] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api.policy().then(setPolicy).catch((e) => setError(e.message)); }, []);
  if (error) return <div className="alert bad">{error}</div>;
  if (!policy) return <p className="muted">Loading…</p>;
  const { config } = policy;

  return (
    <>
      <h1>Expense policy</h1>
      <p className="muted">This is the policy the assistant retrieves from and cites.</p>
      <div className="card">
        <h2>Limits (in {config.baseCurrency})</h2>
        <table>
          <thead><tr><th>Category</th><th className="num">Per claim</th><th className="num">Per month</th></tr></thead>
          <tbody>{policy.categories.map((c) => (
            <tr key={c.key}><td>{c.label}</td><td className="num mono">{formatMoney(c.perClaimLimit)}</td><td className="num mono">{formatMoney(c.monthlyLimit)}</td></tr>
          ))}</tbody>
        </table>
        <p className="small muted" style={{ marginBottom: 0 }}>Receipt required above {formatMoney(config.receiptThresholdBase)} · claims must be filed within {config.maxClaimAgeDays} days · AI confidence below {Math.round(config.uncertaintyThreshold * 100)}% is marked uncertain.</p>
      </div>
      {policy.sections.map((s) => (
        <section className="card policy-section" id={s.id} key={s.id}>
          <h3>{s.id}: {s.title}</h3>
          <p style={{ margin: 0 }}>{s.text}</p>
        </section>
      ))}
    </>
  );
}
