import type { Metadata } from 'next';
import '@/styles/globals.css';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'Paw Paw 泡泡｜寵物美容預約系統',
  description:
    '預約寵物美容服務、管理會員帳號、美容師後台管理。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen bg-[#F9FAFB] text-[#111827] antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
