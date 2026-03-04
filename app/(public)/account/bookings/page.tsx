'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Tabs from '@/components/ui/Tabs';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import { getCurrentUser } from '@/lib/auth';
import { getBookings, getGroomers, getServices } from '@/lib/api';
import { formatDateTime, formatPrice, getStatusLabel, getStatusColor } from '@/lib/format';
import type { Booking, Groomer, Service } from '@/types';

const STATUS_TABS = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待確認' },
  { key: 'confirmed', label: '已確認' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
];

type BookingRow = Booking & {
  groomerName: string;
  serviceName: string;
  [key: string]: unknown;
};

export default function AccountBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;

    async function load() {
      try {
        setLoading(true);
        const user = getCurrentUser()!;
        const [allBookings, grmrs, svcs] = await Promise.all([
          getBookings({ customerEmail: user.email }),
          getGroomers(),
          getServices(),
        ]);

        const rows: BookingRow[] = allBookings.map((b) => {
          const groomer = grmrs.find((g: Groomer) => g.id === b.groomerId);
          const svc = svcs.find((s: Service) => s.id === b.serviceId);
          return {
            ...b,
            groomerName: groomer?.displayName ?? '未知',
            serviceName: svc?.name ?? '未知',
          };
        });

        setBookings(rows);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [authChecked]);

  const filteredBookings =
    statusFilter === 'all'
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  const columns: {
    key: string;
    label: string;
    render?: (row: BookingRow) => React.ReactNode;
  }[] = [
    {
      key: 'serviceName',
      label: '服務',
      render: (row: BookingRow) => (
        <span className="font-medium text-gray-900">{row.serviceName}</span>
      ),
    },
    {
      key: 'groomerName',
      label: '美容師',
    },
    {
      key: 'startAt',
      label: '日期時間',
      render: (row: BookingRow) => formatDateTime(row.startAt),
    },
    {
      key: 'price',
      label: '費用',
      render: (row: BookingRow) => (
        <span className="font-medium">{formatPrice(row.price)}</span>
      ),
    },
    {
      key: 'status',
      label: '狀態',
      render: (row: BookingRow) => (
        <Badge
          className={getStatusColor(row.status)}
          size="sm"
        >
          {getStatusLabel(row.status)}
        </Badge>
      ),
    },
  ];

  if (!authChecked) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">我的預約</h1>
        <p className="mt-1 text-gray-500">查看與管理所有預約記錄</p>
      </div>

      {/* Status Filter Tabs */}
      <Tabs tabs={STATUS_TABS} activeTab={statusFilter} onChange={setStatusFilter} />

      {/* Bookings Table */}
      <div className="mt-6">
        <DataTable<BookingRow>
          columns={columns}
          data={filteredBookings}
          loading={loading}
          emptyMessage="沒有找到預約記錄"
          onRowClick={(row) => {
            router.push(`/account/bookings/${row.id}`);
          }}
        />
      </div>
    </div>
  );
}
