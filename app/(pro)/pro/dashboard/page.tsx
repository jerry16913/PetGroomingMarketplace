'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatsCards from '@/components/StatsCards';
import Card from '@/components/ui/Card';
import DataTable from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import { getCurrentUser } from '@/lib/auth';
import { getBookings, getReviews, getServices } from '@/lib/api';
import {
  formatPrice,
  formatDate,
  formatTime,
  getStatusLabel,
  getStatusColor,
  formatRating,
} from '@/lib/format';
import type { Booking, Review, Service } from '@/types';
import dayjs from 'dayjs';

export default function ProDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const user = getCurrentUser();
        if (!user?.groomerId) return;

        const [allBookings, allReviews, allServices] = await Promise.all([
          getBookings({ groomerId: user.groomerId }),
          getReviews(user.groomerId),
          getServices(),
        ]);
        setBookings(allBookings);
        setReviews(allReviews);
        setServices(allServices);
      } catch {
        setError('載入資料失敗，請稍後重試。');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const today = dayjs().format('YYYY-MM-DD');
  const todayBookings = bookings.filter(
    (b) => dayjs(b.startAt).format('YYYY-MM-DD') === today
  );

  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();
  const monthBookings = bookings.filter((b) => {
    const d = dayjs(b.startAt);
    return (
      d.month() === currentMonth &&
      d.year() === currentYear &&
      b.status === 'completed'
    );
  });
  const monthRevenue = monthBookings.reduce((sum, b) => sum + b.price, 0);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const stats = [
    { label: '今日訂單數', value: todayBookings.length },
    { label: '本月收入', value: formatPrice(monthRevenue) },
    { label: '平均評分', value: formatRating(avgRating) },
    { label: '總評價數', value: reviews.length },
  ];

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
      label: '時間',
      render: (row: Booking) => formatTime(row.startAt),
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
        <h1 className="text-2xl font-semibold text-gray-900">儀表板</h1>
        <p className="mt-1 text-sm text-gray-500">
          歡迎回來！以下是您的服務概況。
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
              <Skeleton variant="text" width="50%" />
              <Skeleton variant="text" width="40%" height={32} className="mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <StatsCards stats={stats} />
      )}

      {/* Today's bookings */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">
            今日訂單 ({formatDate(dayjs().toISOString())})
          </h2>
        </div>
        <DataTable<Booking & Record<string, unknown>>
          columns={columns}
          data={todayBookings as (Booking & Record<string, unknown>)[]}
          loading={loading}
          emptyMessage="今日尚無訂單"
          onRowClick={(row) => router.push(`/pro/bookings/${row.id}`)}
        />
      </Card>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => router.push('/pro/bookings')}>
          查看所有訂單
        </Button>
        <Button variant="outline" onClick={() => router.push('/pro/profile')}>
          編輯資料
        </Button>
      </div>
    </div>
  );
}
