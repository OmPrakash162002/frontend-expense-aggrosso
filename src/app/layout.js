import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import AppShell from '@/components/AppShell';

export const metadata = {
  title: 'Expense Claim Review',
  description: 'Review employee expense claims against the expense policy',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
