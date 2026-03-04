'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Groomer, Booking, Review } from '@/types';
import {
  getGroomer,
  getBookings,
  getReviews,
  approveGroomer,
  suspendGroomer,
} from '@/lib/api';
import {
  formatRating,
  formatDate,
  formatTime,
  formatPrice,
  getStatusLabel,
  getStatusColor,
  getPaymentStatusLabel,
} from '@/lib/format';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import ReviewList from '@/components/ReviewList';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';

export default function AdminGroomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params.id as string;

  const [groomer, setGroomer] = useState<Groomer | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [pro, bks, revs] = await Promise.all([
        getGroomer(id),
        getBookings({ groomerId: id }),
        getReviews(id),
      ]);
      if (!pro) {
        setError('找不到該美容師');
        return;
      }
      setGroomer(pro);
      setBookings(bks);
      setReviews(revs);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入資料失敗');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const updated = await approveGroomer(id);
      setGroomer(updated);
      showToast('已核准該美容師', 'success');
    } catch {
      showToast('操作失敗', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      const updated = await suspendGroomer(id);
      setGroomer(updated);
      showToast('已拒絕該美容師', 'success');
    } catch {
      showToast('操作失敗', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    setActionLoading(true);
    try {
      const updated = await suspendGroomer(id);
      setGroomer(updated);
      showToast('已停權該美容師', 'success');
    } catch {
      showToast('操作失敗', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async () => {
    setActionLoading(true);
    try {
      const updated = await approveGroomer(id);
      setGroomer(updated);
      showToast('已恢復該美容師', 'success');
    } catch {
      showToast('操作失敗', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="rect" height={200} />
        <Skeleton variant="rect" height={300} />
      </div>
    );
  }

  if (error || !groomer) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">{error || '找不到該美容師'}</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          返回
        </Button>
      </div>
    );
  }

  const bookingColumns = [
    { key: 'id', label: '訂單編號' },
    { key: 'customerName', label: '顧客' },
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
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(row.status as string)}`}>
          {getStatusLabel(row.status as string)}
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      label: '付款',
      render: (row: Record<string, unknown>) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(row.paymentStatus as string)}`}>
          {getPaymentStatusLabel(row.paymentStatus as string)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回列表
      </button>

      {/* Groomer Profile */}
      <Card>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
              {groomer.displayName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{groomer.displayName}</h1>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(groomer.status)}`}>
                  {getStatusLabel(groomer.status)}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{groomer.bio}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {formatRating(groomer.ratingAvg)} ({groomer.ratingCount} 則)
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                <span>Email: {groomer.email}</span>
                <span>電話: {groomer.phone}</span>
                <span>加入日期: {formatDate(groomer.joinedAt)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 shrink-0">
            {groomer.status === 'pending' && (
              <>
                <Button onClick={handleApprove} loading={actionLoading}>
                  核准
                </Button>
                <Button variant="danger" onClick={handleReject} loading={actionLoading}>
                  拒絕
                </Button>
              </>
            )}
            {groomer.status === 'approved' && (
              <Button variant="danger" onClick={handleSuspend} loading={actionLoading}>
                停權
              </Button>
            )}
            {groomer.status === 'suspended' && (
              <Button onClick={handleRestore} loading={actionLoading}>
                恢復
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Bookings */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          訂單記錄 ({bookings.length})
        </h2>
        <DataTable
          columns={bookingColumns}
          data={bookings as unknown as Record<string, unknown>[]}
          onRowClick={(row) => router.push(`/admin/bookings/${row.id}`)}
          emptyMessage="尚無訂單"
        />
      </div>

      {/* Reviews */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          評價 ({reviews.length})
        </h2>
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
}
