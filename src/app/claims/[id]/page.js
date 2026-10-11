'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import { StatusBadge } from '@/components/Badges';
import ValidationPanel from '@/components/ValidationPanel';
import AiPanel from '@/components/AiPanel';
import ReviewActions from '@/components/ReviewActions';
import DecisionCard from '@/components/DecisionCard';
import ClarificationList from '@/components/ClarificationList';
import HistoryTimeline from '@/components/HistoryTimeline';
import { formatDate, formatMoney, categoryLabel } from '@/lib/format';

export default function ClaimDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try { setData(await api.getClaim(id)); setError(''); } catch (e) { setError(e.message); }
  }, [id]);

  useEffect(() => { load(); api.policy().then(setPolicy).catch(() => {}); }, [load]);

  const policyById = useMemo(() => Object.fromEntries((policy?.sections || []).map((s) => [s.id, s])), [policy]);

  async function reanalyse() {
    setBusy(true);
    try { setData(await api.reanalyse(id)); } catch (e) { setError(e.message); } finally { setBusy(false); }
  }

  if (error && !data) return <div className="alert bad">{error} <Link href="/">Back to claims</Link></div>;
  if (!data || !policy) return <p className="muted">Loading…</p>;
  const { claim, history } = data;

  const isReviewer = user.role === 'reviewer';
  const isOwner = claim.claimantId === user.id;
  const canReview = isReviewer && !isOwner; // the server enforces this too
  const final = ['approved', 'rejected'].includes(claim.status);

  return (
    <>
      <p className="small"><Link href="/">← {isReviewer ? 'All claims' : 'My claims'}</Link></p>
      {error && <div className="alert bad">{error}</div>}
      <div className="row spread" style={{ marginBottom: '1rem' }}>
        <div>
          <h1>{claim.claimant}: {formatMoney(claim.amount, claim.currency)}</h1>
          <span className="muted">{formatDate(claim.date)} · {categoryLabel(claim.effectiveCategory) || 'Unclassified'}</span>
        </div>
        <StatusBadge status={claim.status} />
      </div>

      <div className="grid2">
        <div>
          <section className="card">
            <h2>Claim</h2>
            <dl className="kv">
              <dt>Description</dt><dd>{claim.description}</dd>
              <dt>Claimed category</dt><dd>{categoryLabel(claim.category)}</dd>
              <dt>Receipt</dt><dd>{claim.receiptAvailable ? 'Yes' : 'No'}</dd>
              <dt>Submitted by</dt><dd>{claim.submittedBy}</dd>
            </dl>
          </section>
          <ValidationPanel claim={claim} policy={policy} policyById={policyById} />
          {isReviewer && claim.ai && <AiPanel claim={claim} policyById={policyById} onReanalyse={canReview ? reanalyse : undefined} busy={busy} />}
        </div>
        <div>
          {canReview && <ReviewActions claim={claim} categories={policy.categories} onChange={load} />}
          {isReviewer && isOwner && <div className="alert warn">This is your own claim. Another reviewer has to decide it.</div>}
          {!isReviewer && !final && (
            <div className="alert info">
              {claim.status === 'needs_clarification'
                ? 'A reviewer has asked you a question. Please answer it below.'
                : 'Your claim has been submitted and is waiting for a reviewer.'}
            </div>
          )}
          {!canReview && final && <DecisionCard claim={claim} />}
          <ClarificationList claim={claim} canAnswer={isOwner} onChange={load} />
          <HistoryTimeline history={history} />
        </div>
      </div>
    </>
  );
}
