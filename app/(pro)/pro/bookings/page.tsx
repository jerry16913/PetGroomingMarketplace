'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Tabs from '@/components/ui/Tabs';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import { getCurrentUser } from '@/lib/auth';
import { getBookings, getServices } from '@/lib/api';
import {
  formatPrice,
  formatDateTime,
  getStatusLabel,
  getStatusColor,
  getPaymentStatusLabel,
} from '@/lib/format';
import type { Booking, Service } from '@/types';

const STATUS_TABS = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待確認' },
  { key: 'confirmed', label: '已確認' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
  { key: 'no_show', label: '未到場' },
];

export default function ProBookingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const user = getCurrentUser();
        if (!user?.groomerId) return;

        const [allBookings, allServices] = await Promise.all([
          getBookings({ groomerId: user.groomerId }),
          getServices(),
        ]);
        setBookings(allBookings);
        setServices(allServices);
      } catch {
        setError('載入訂單資料失敗，請稍後重試。');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredBookings =
    activeTab === 'all'
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  const getServiceName = (serviceId: string) => {
    return services.find((s) => s.id === serviceId)?.name ?? serviceId;
  };

  const columns = [
    {
      key: 'customerName',
      label: '客戶',
    },
    {
      key: 'serviceId',
      label: '服務',
      render: (row: Booking) => getServiceName(row.serviceId),
    },
    {
      key: 'startAt',
      label: '日期/時間',
      render: (row: Booking) => formatDateTime(row.startAt),
    },
    {
      key: 'price',
      label: '金額',
      render: (row: Booking) => formatPrice(row.price),
    },
    {
      key: 'status',
      label: '狀態',
      render: (row: Booking) => (
        <Badge className={getStatusColor(row.status)}>
          {getStatusLabel(row.status)}
        </Badge>
      ),
    },
    {
      key: 'paymentStatus',
      label: '付款狀態',
      render: (row: Booking) => (
        <Badge className={getStatusColor(row.paymentStatus)}>
          {getPaymentStatusLabel(row.paymentStatus)}
        </Badge>
      ),
    },
  ];

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">訂單管理</h1>
        <p className="mt-1 text-sm text-gray-500">
          檢視與管理所有客戶預約訂單。
        </p>
      </div>

      {/* Filter tabs */}
      {loading ? (
        <Skeleton variant="rect" height={40} />
      ) : (
        <Tabs
          tabs={STATUS_TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      )}

      {/* Bookings table */}
      <DataTable<Booking & Record<string, unknown>>
        columns={columns}
        data={filteredBookings as (Booking & Record<string, unknown>)[]}
        loading={loading}
        emptyMessage="沒有符合條件的訂單"
        onRowClick={(row) => router.push(`/pro/bookings/${row.id}`)}
      />
    </div>
  );
}
