import ProBookingDetailPage from './_client';

export function generateStaticParams() {
  return Array.from({ length: 20 }, (_, i) => ({ id: `b${i + 1}` }));
}

export default function Page() {
  return <ProBookingDetailPage />;
}
