import AdminGroomerDetailPage from './_client';

export function generateStaticParams() {
  return Array.from({ length: 10 }, (_, i) => ({ id: `p${i + 1}` }));
}

export default function Page() {
  return <AdminGroomerDetailPage />;
}
