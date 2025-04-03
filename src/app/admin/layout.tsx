'use client';

import { Toaster } from 'react-hot-toast';
import './adminglobal.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
} 