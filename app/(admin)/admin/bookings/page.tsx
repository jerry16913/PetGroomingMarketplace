'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Booking, Groomer, Service } from '@/types';
import { getBookings, getGroomers, getServices } from '@/lib/api';
import {
  formatPrice,
  formatDate,
  formatTime,
  getStatusLabel,
  getStatusColor,
  getPaymentStatusLabel,
} from '@/lib/format';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import Skeleton from '@/components/ui/Skeleton';

const statusTabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待確認' },
  { key: 'confirmed', label: '已確認' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
  { key: 'no_show', label: '未到場' },
];

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [groomers, setGroomers] = useState<Groomer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function load() {
      try {
        const [b, g, s] = await Promise.all([
          getBookings(),
          getGroomers(),
          getServices(),
        ]);
        setBookings(b);
        setGroomers(g);
        setServices(s);
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
          <h1 className="text-2xl font-semibold text-gray-900">訂單管理</h1>
          <p className="text-sm text-gray-500 mt-1">檢視與管理所有預約訂單。</p>
        </div>
        <Skeleton variant="rect" height={48} />
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

  const groomerMap = new Map(groomers.map((g) => [g.id, g]));
  const svcMap = new Map(services.map((s) => [s.id, s]));

  const filtered =
    activeTab === 'all'
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  // Sort by createdAt desc
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const columns = [
    { key: 'id', label: '訂單編號' },
    { key: 'customerName', label: '顧客' },
    {
      key: 'groomer',
      label: '美容師',
      render: (row: Record<string, unknown>) =>
        groomerMap.get(row.groomerId as string)?.displayName ?? '-',
    },
    {
      key: 'service',
      label: '服務',
      render: (row: Record<string, unknown>) =>
        svcMap.get(row.serviceId as string)?.name ?? '-',
    },
    {
      key: 'startAt',
      label: '日期/時間',
      render: (row: Record<string, unknown>) =>
        `${formatDate(row.startAt as string)} ${formatTime(row.startAt as string)}`,
    },
    {
      key: 'price',
      label: '金額',
      render: (row: Record<string, unknown>) => formatPrice(row.price as number),
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
        <h1 className="text-2xl font-semibold text-gray-900">訂單管理</h1>
        <p className="text-sm text-gray-500 mt-1">檢視與管理所有預約訂單。</p>
      </div>

      <Tabs tabs={statusTabs} activeTab={activeTab} onChange={setActiveTab} />

      <DataTable
        columns={columns}
        data={sorted as unknown as Record<string, unknown>[]}
        onRowClick={(row) => router.push(`/admin/bookings/${row.id}`)}
        emptyMessage="沒有符合條件的訂單"
      />
    </div>
  );
}
