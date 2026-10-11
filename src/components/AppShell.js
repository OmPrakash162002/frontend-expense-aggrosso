'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

const PUBLIC_PATHS = ['/login', '/admin/login', '/register'];

// Header + route guard: signed-out visitors are sent to a sign-in page, signed-in users are kept off it.
export default function AppShell({ children }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isPublic = PUBLIC_PATHS.includes(pathname);

  // After sign-out (or an expired session) send people back to the sign-in page they used
  const lastRole = useRef('employee');
  if (user) lastRole.current = user.role;
  const loginPath = lastRole.current === 'reviewer' ? '/admin/login' : '/login';

  useEffect(() => {
    if (loading) return;
    if (!user && !isPublic) router.replace(loginPath);
    if (user && isPublic) router.replace('/');
  }, [loading, user, isPublic, router, loginPath]);

  const ready = !loading && ((user && !isPublic) || (!user && isPublic));

  return (
    <>
      <header className="topbar">
        <div className="container row">
          <strong>Expense claim review</strong>
          {user && (
            <nav>
              <Link href="/">{user.role === 'reviewer' ? 'Claims' : 'My claims'}</Link>
              <Link href="/claims/new">New claim</Link>
              <Link href="/policy">Policy</Link>
            </nav>
          )}
          {user && (
            <div className="userbox">
              <span>{user.name}</span> <span className="badge neutral">{user.role}</span>
              <button className="linkbtn" onClick={logout}>Sign out</button>
            </div>
          )}
        </div>
      </header>
      <main className="container">{ready ? children : <p className="muted">Loading…</p>}</main>
    </>
  );
}