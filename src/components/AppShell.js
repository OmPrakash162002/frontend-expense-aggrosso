'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

const PUBLIC_PATHS = ['/login', '/register'];

// Header + route guard: signed-out visitors are sent to /login, signed-in users are kept off /login.
export default function AppShell({ children }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isPublic = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (loading) return;
    if (!user && !isPublic) router.replace('/login');
    if (user && isPublic) router.replace('/');
  }, [loading, user, isPublic, router]);

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
