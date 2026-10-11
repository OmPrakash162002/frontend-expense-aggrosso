export const formatMoney = (n, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 2 }).format(n ?? 0);

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }) : '';

export const formatDateTime = (d) =>
  d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';

export const categoryLabel = (key) =>
  !key ? '' : key === 'other' ? 'Other / not sure' : key.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());

export const STATUS_LABEL = {
  pending_review: 'Pending review',
  needs_clarification: 'Needs clarification',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const VERDICT_LABEL = { comply: 'Appears to comply', clarify: 'Needs clarification', review: 'Needs human review' };
