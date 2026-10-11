import { STATUS_LABEL, VERDICT_LABEL } from '@/lib/format';

const STATUS_TONE = { pending_review: 'info', needs_clarification: 'warn', approved: 'ok', rejected: 'bad' };
const VERDICT_TONE = { comply: 'ok', clarify: 'warn', review: 'bad' };

export const StatusBadge = ({ status }) => <span className={`badge ${STATUS_TONE[status] || 'neutral'}`}>{STATUS_LABEL[status] || status}</span>;
export const VerdictBadge = ({ verdict }) => <span className={`badge ${VERDICT_TONE[verdict] || 'neutral'}`}>{VERDICT_LABEL[verdict] || verdict}</span>;
export const SeverityBadge = ({ severity }) => <span className={`badge ${severity === 'error' ? 'bad' : 'warn'}`}>{severity === 'error' ? 'Issue' : 'Warning'}</span>;
export const UncertainBadge = () => <span className="badge warn" title="Low-confidence classification">Uncertain</span>;
