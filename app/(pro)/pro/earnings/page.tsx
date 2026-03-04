'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import StatsCards from '@/components/StatsCards';
import { getCurrentUser } from '@/lib/auth';
import { getBookings, getServices } from '@/lib/api';
import {
  formatPrice,
  formatDate,
  getStatusLabel,
  getStatusColor,
  getPaymentStatusLabel,
} from '@/lib/format';
import type { Booking, Service } from '@/types';
import dayjs from 'dayjs';

interface MonthData {
  month: string; // e.g. "2024/01"
  label: string; // e.g. "1月"
  revenue: number;
  count: number;
}

export default function ProEarningsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);

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
        setError('載入收入資料失敗，請稍後重試。');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Compute completed bookings
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const totalRevenue = completedBookings.reduce((sum, b) => sum + b.price, 0);
  const avgPerBooking =
    completedBookings.length > 0
      ? Math.round(totalRevenue / completedBookings.length)
      : 0;

  // Last 6 months data
  const last6Months: MonthData[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = dayjs().subtract(i, 'month');
    const monthKey = d.format('YYYY/MM');
    const monthLabel = `${d.month() + 1}月`;
    const monthBookings = completedBookings.filter(
      (b) => dayjs(b.startAt).format('YYYY/MM') === monthKey
    );
    const revenue = monthBookings.reduce((sum, b) => sum + b.price, 0);
    last6Months.push({
      month: monthKey,
      label: monthLabel,
      revenue,
      count: monthBookings.length,
    });
  }

  const maxRevenue = Math.max(...last6Months.map((m) => m.revenue), 1);

  const getServiceName = (serviceId: string) => {
    return services.find((s) => s.id === serviceId)?.name ?? serviceId;
  };

  // Transaction detail -- all completed bookings sorted by date desc
  const transactions = [...completedBookings].sort(
    (a, b) => dayjs(b.startAt).valueOf() - dayjs(a.startAt).valueOf()
  );

  const transactionColumns = [
    {
      key: 'startAt',
      label: '日期',
      render: (row: Booking) => formatDate(row.startAt),
    },
    {
      key: 'serviceId',
      label: '服務',
      render: (row: Booking) => getServiceName(row.serviceId),
    },
    {
      key: 'customerName',
      label: '客戶',
    },
    {
      key: 'price',
      label: '金額',
      render: (row: Booking) => (
        <span className="font-medium text-gray-900">
          {formatPrice(row.price)}
        </span>
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

  const stats = [
    { label: '總收入', value: formatPrice(totalRevenue) },
    { label: '已完成訂單', value: completedBookings.length },
    { label: '平均單價', value: formatPrice(avgPerBooking) },
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
        <h1 className="text-2xl font-semibold text-gray-900">收入報表</h1>
        <p className="mt-1 text-sm text-gray-500">
          查看您的收入統計與交易明細。
        </p>
      </div>

      {/* Summary stats */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
              <Skeleton variant="text" width="50%" />
              <Skeleton variant="text" width="40%" height={32} className="mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <StatsCards stats={stats} />
      )}

      {/* Bar chart */}
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          近 6 個月收入趨勢
        </h2>
        {loading ? (
          <div className="flex items-end gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rect" width={60} height={100 + i * 20} />
            ))}
          </div>
        ) : (
          <div className="flex items-end justify-around gap-2 pt-4" style={{ height: 240 }}>
            {last6Months.map((m) => {
              const barHeight = maxRevenue > 0
                ? Math.max((m.revenue / maxRevenue) * 180, 4)
                : 4;
              return (
                <div
                  key={m.month}
                  className="flex flex-col items-center gap-1"
                >
                  {/* Value label */}
                  <span className="text-xs font-medium text-gray-700">
                    {m.revenue > 0 ? formatPrice(m.revenue) : '-'}
                  </span>
                  {/* Bar */}
                  <div
                    className="w-12 rounded-t-md bg-[#4884B8] transition-all duration-500 sm:w-16"
                    style={{ height: barHeight }}
                  />
                  {/* Month label */}
                  <span className="text-xs text-gray-500">{m.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Transaction details */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">
            交易明細
          </h2>
        </div>
        <DataTable<Booking & Record<string, unknown>>
          columns={transactionColumns}
          data={transactions as (Booking & Record<string, unknown>)[]}
          loading={loading}
          emptyMessage="尚無已完成的交易紀錄"
        />
      </Card>
    </div>
  );
}
