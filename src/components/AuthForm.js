'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';

export default function AuthForm({ mode }) {
  const { login, register } = useAuth();
  const isRegister = mode === 'register';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError(''); setFieldErrors({});
    try {
      if (isRegister) await register(form.name, form.email, form.password);
      else await login(form.email, form.password);
      // AppShell redirects to the dashboard once the user is set
    } catch (err) {
      setError(err.message);
      setFieldErrors(Object.fromEntries((err.details || []).map((d) => [d.field, d.message])));
      setBusy(false);
    }
  }

  const field = (name, label, props) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} value={form[name]} onChange={set(name)} required {...props} />
      {fieldErrors[name] && <div className="err">{fieldErrors[name]}</div>}
    </div>
  );

  return (
    <div className="authcard card">
      <h1>{isRegister ? 'Create an account' : 'Sign in'}</h1>
      <p className="muted">{isRegister ? 'New accounts are employee accounts. A reviewer can be assigned later by an administrator.' : 'Use your work email and password.'}</p>
      {error && <div className="alert bad">{error}</div>}
      <form onSubmit={submit} noValidate>
        {isRegister && field('name', 'Full name', { autoComplete: 'name' })}
        {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
        {field('password', 'Password', { type: 'password', autoComplete: isRegister ? 'new-password' : 'current-password', minLength: 8 })}
        {isRegister && <p className="muted small" style={{ marginTop: '-.4rem' }}>At least 8 characters.</p>}
        <button className="primary" disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}</button>
      </form>
      <p className="small" style={{ marginBottom: 0 }}>
        {isRegister ? <>Already have an account? <Link href="/login">Sign in</Link></> : <>No account yet? <Link href="/register">Create one</Link></>}
      </p>
    </div>
  );
}
