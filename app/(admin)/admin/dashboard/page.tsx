'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Booking, Groomer } from '@/types';
import { getBookings, getGroomers } from '@/lib/api';
import { formatPrice, formatDate, formatTime, getStatusLabel, getStatusColor, getPaymentStatusLabel } from '@/lib/format';
import StatsCards from '@/components/StatsCards';
import DataTable from '@/components/ui/DataTable';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [groomers, setGroomers] = useState<Groomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [b, g] = await Promise.all([
          getBookings(),
          getGroomers(),
        ]);
        setBookings(b);
        setGroomers(g);
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入資料失敗');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">儀表板</h1>
          <p className="text-sm text-gray-500 mt-1">平台營運數據與近期訂單概覽。</p>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rect" height={120} />
          ))}
        </div>
        <Skeleton variant="rect" height={400} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Compute stats
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const gmv = completedBookings.reduce((sum, b) => sum + b.price, 0);
  const activeGroomers = groomers.filter((g) => g.status === 'approved').length;
  const mockUsageRate = 72;

  const stats = [
    {
      label: 'GMV (總營收)',
      value: formatPrice(gmv),
      change: '+12.5%',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: '總訂單數',
      value: bookings.length,
      change: '+8.3%',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: '活躍美容師數',
      value: activeGroomers,
      change: '+3',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: '本月使用率',
      value: `${mockUsageRate}%`,
      change: '+5.2%',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  // Recent 10 bookings sorted by createdAt desc
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  // Groomer lookup
  const groomerMap = new Map(groomers.map((g) => [g.id, g]));

  const bookingColumns = [
    { key: 'id', label: '訂單編號' },
    { key: 'customerName', label: '顧客' },
    {
      key: 'groomer',
      label: '美容師',
      render: (row: Record<string, unknown>) =>
        groomerMap.get(row.groomerId as string)?.displayName ?? '-',
    },
    {
      key: 'price',
      label: '金額',
      render: (row: Record<string, unknown>) => formatPrice(row.price as number),
    },
    {
      key: 'startAt',
      label: '預約時間',
      render: (row: Record<string, unknown>) =>
        `${formatDate(row.startAt as string)} ${formatTime(row.startAt as string)}`,
    },
    {
      key: 'status',
      label: '狀態',
      render: (row: Record<string, unknown>) => (
        <Badge className={getStatusColor(row.status as string)}>
          {getStatusLabel(row.status as string)}
        </Badge>
      ),
    },
    {
      key: 'paymentStatus',
      label: '付款',
      render: (row: Record<string, unknown>) => (
        <Badge className={getStatusColor(row.paymentStatus as string)}>
          {getPaymentStatusLabel(row.paymentStatus as string)}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">儀表板</h1>
        <p className="text-sm text-gray-500 mt-1">平台營運數據與近期訂單概覽。</p>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Recent Bookings */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">最近訂單</h2>
        </div>
        <DataTable
          columns={bookingColumns}
          data={recentBookings as unknown as Record<string, unknown>[]}
          onRowClick={(row) => router.push(`/admin/bookings/${row.id}`)}
        />
      </Card>

      {/* Groomer Quick Stats */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-gray-900">美容師統計</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-500">總美容師數</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{groomers.length}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-500">已核准</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{groomers.filter((g) => g.status === 'approved').length}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-500">待審核</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{groomers.filter((g) => g.status === 'pending').length}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-500">已停權</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{groomers.filter((g) => g.status === 'suspended').length}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
