'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import ClaimTable from '@/components/ClaimTable';
import TotalsBar from '@/components/TotalsBar';
import { STATUS_LABEL } from '@/lib/format';

export default function Dashboard() {
  const { user } = useAuth();
  const reviewer = user?.role === 'reviewer';
  const [claims, setClaims] = useState([]);
  const [totals, setTotals] = useState(null);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [list, summary] = await Promise.all([api.listClaims({ status, q }), api.summary()]);
      setClaims(list.claims);
      setTotals(summary.totals);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [status, q]);

  useEffect(() => {
    const t = setTimeout(load, 250); // debounce typing in the search box
    return () => clearTimeout(t);
  }, [load]);

  return (
    <>
      <div className="row spread" style={{ marginBottom: '1rem' }}>
        <div><h1>{reviewer ? 'Claims' : 'My claims'}</h1><p className="muted" style={{ margin: 0 }}>{reviewer ? 'Review claims against the expense policy.' : 'Claims you have submitted and their status.'}</p></div>
        <Link className="btn primary" href="/claims/new">New claim</Link>
      </div>
      {error && <div className="alert bad">{error}</div>}
      <TotalsBar totals={totals} />
      <div className="card">
        <div className="row" style={{ marginBottom: '.8rem' }}>
          <div className="grow"><input placeholder="Search claimant or description" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search claims" /></div>
          <div style={{ width: 200 }}>
            <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
              <option value="">All statuses</option>
              {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>
        {loading && !claims.length ? <p className="muted">Loading…</p> : <ClaimTable claims={claims} />}
      </div>
    </>
  );
}
