'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from './AuthProvider';
import { categoryLabel } from '@/lib/format';

const today = () => new Date().toISOString().slice(0, 10);
const EMPTY = { date: today(), category: 'other', amount: '', currency: 'INR', description: '', receiptAvailable: 'yes' };

function Field({ name, label, error, children }) {
  return (
    <div className="field"><label htmlFor={name}>{label}</label>{children}{error && <div className="err">{error}</div>}</div>
  );
}

export default function ClaimForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [policy, setPolicy] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { api.policy().then(setPolicy).catch((e) => setError(e.message)); }, []);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError(''); setFieldErrors({});
    try {
      const { claim } = await api.createClaim({ ...form, amount: form.amount, receiptAvailable: form.receiptAvailable === 'yes' });
      router.push(`/claims/${claim._id}`);
    } catch (err) {
      setError(err.message);
      setFieldErrors(Object.fromEntries((err.details || []).map((d) => [d.field, d.message])));
      setBusy(false);
    }
  }


  return (
    <form onSubmit={submit} className="card" noValidate>
      {error && <div className="alert bad">{error}</div>}
      <div className="formgrid">
        <Field error={fieldErrors.claimant} name="claimant" label="Claimant"><div className="readonly">{user?.name}</div></Field>
        <Field error={fieldErrors.date} name="date" label="Expense date"><input id="date" type="date" max={today()} value={form.date} onChange={set('date')} /></Field>
        <Field error={fieldErrors.category} name="category" label="Category">
          <select id="category" value={form.category} onChange={set('category')}>
            {(policy?.categories || []).map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            <option value="other">{categoryLabel('other')}</option>
          </select>
        </Field>
        <div className="formgrid" style={{ gridTemplateColumns: '2fr 1fr', gap: '0 .6rem' }}>
          <Field error={fieldErrors.amount} name="amount" label="Amount"><input id="amount" inputMode="decimal" value={form.amount} onChange={set('amount')} placeholder="0.00" /></Field>
          <Field error={fieldErrors.currency} name="currency" label="Currency">
            <select id="currency" value={form.currency} onChange={set('currency')}>
              {Object.keys(policy?.config.rates || { INR: 1 }).map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
      </div>
      <Field error={fieldErrors.description} name="description" label="Description">
        <textarea id="description" value={form.description} onChange={set('description')} placeholder="What was the expense and why was it needed?" maxLength={500} />
      </Field>
      <Field error={fieldErrors.receiptAvailable} name="receiptAvailable" label="Receipt available?">
        <div className="radios">
          {['yes', 'no'].map((v) => (
            <label key={v}><input type="radio" name="receipt" checked={form.receiptAvailable === v} onChange={() => setForm((f) => ({ ...f, receiptAvailable: v }))} />{v === 'yes' ? 'Yes' : 'No'}</label>
          ))}
        </div>
      </Field>
      <button className="primary" disabled={busy}>{busy ? 'Submitting and analysing…' : 'Submit claim'}</button>
    </form>
  );
}
