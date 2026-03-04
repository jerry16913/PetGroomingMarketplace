'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Booking, Groomer, Service, Resource } from '@/types';
import {
  getBooking,
  getGroomer,
  getService,
  getResources,
  updateBookingStatus,
  updatePaymentStatus,
} from '@/lib/api';
import {
  formatPrice,
  formatDate,
  formatTime,
  formatDateTime,
  formatDuration,
  getStatusLabel,
  getStatusColor,
  getPaymentStatusLabel,
} from '@/lib/format';
import ResourceBadge from '@/components/ResourceBadge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';

const bookingStatuses = [
  { value: 'pending', label: '待確認' },
  { value: 'confirmed', label: '已確認' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
  { value: 'no_show', label: '未到場' },
];

const paymentStatuses = [
  { value: 'unpaid', label: '未付款' },
  { value: 'paid', label: '已付款' },
  { value: 'refunded', label: '已退款' },
];

export default function AdminBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [groomer, setGroomer] = useState<Groomer | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const bk = await getBooking(id);
      if (!bk) {
        setError('找不到該訂單');
        return;
      }
      setBooking(bk);
      setNewStatus(bk.status);
      setNewPaymentStatus(bk.paymentStatus);

      const [pro, svc, res] = await Promise.all([
        getGroomer(bk.groomerId),
        getService(bk.serviceId),
        getResources(),
      ]);
      setGroomer(pro ?? null);
      setService(svc ?? null);
      setResources(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入資料失敗');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateStatus = async () => {
    if (!booking || newStatus === booking.status) return;
    setStatusLoading(true);
    try {
      const updated = await updateBookingStatus(id, newStatus as Booking['status']);
      setBooking(updated);
      showToast('訂單狀態已更新', 'success');
    } catch {
      showToast('更新失敗', 'error');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleUpdatePayment = async () => {
    if (!booking || newPaymentStatus === booking.paymentStatus) return;
    setPaymentLoading(true);
    try {
      const updated = await updatePaymentStatus(id, newPaymentStatus as Booking['paymentStatus']);
      setBooking(updated);
      showToast('付款狀態已更新', 'success');
    } catch {
      showToast('更新失敗', 'error');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!booking) return;
    setRefundLoading(true);
    try {
      await updatePaymentStatus(id, 'refunded');
      const updated = await updateBookingStatus(id, 'cancelled');
      setBooking({ ...updated, paymentStatus: 'refunded' });
      setNewStatus('cancelled');
      setNewPaymentStatus('refunded');
      showToast('已完成退款處理', 'success');
    } catch {
      showToast('退款處理失敗', 'error');
    } finally {
      setRefundLoading(false);
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

  if (error || !booking) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">{error || '找不到該訂單'}</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          返回
        </Button>
      </div>
    );
  }

  const assignedResources = resources.filter((r) =>
    booking.assignedResourceIds.includes(r.id),
  );

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

      {/* Booking Overview */}
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">訂單 #{booking.id}</h1>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}>
                {getStatusLabel(booking.status)}
              </span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(booking.paymentStatus)}`}>
                {getPaymentStatusLabel(booking.paymentStatus)}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              建立於 {formatDateTime(booking.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">{formatPrice(booking.price)}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customer Info */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">顧客資訊</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">姓名</dt>
              <dd className="text-sm font-medium text-gray-900">{booking.customerName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="text-sm font-medium text-gray-900">{booking.customerEmail}</dd>
            </div>
            {booking.customerPhone && (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">電話</dt>
                <dd className="text-sm font-medium text-gray-900">{booking.customerPhone}</dd>
              </div>
            )}
            {booking.notes && (
              <div>
                <dt className="text-sm text-gray-500 mb-1">備註</dt>
                <dd className="text-sm text-gray-700 rounded-lg bg-gray-50 p-3">{booking.notes}</dd>
              </div>
            )}
          </dl>
        </Card>

        {/* Service Info */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">服務資訊</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">服務</dt>
              <dd className="text-sm font-medium text-gray-900">{service?.name ?? '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">美容師</dt>
              <dd className="text-sm font-medium text-gray-900">
                {groomer ? (
                  <button
                    onClick={() => router.push(`/admin/professionals/${groomer.id}`)}
                    className="text-indigo-600 hover:text-indigo-800 underline"
                  >
                    {groomer.displayName}
                  </button>
                ) : (
                  '-'
                )}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">預約日期</dt>
              <dd className="text-sm font-medium text-gray-900">{formatDate(booking.startAt)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">時間</dt>
              <dd className="text-sm font-medium text-gray-900">
                {formatTime(booking.startAt)} - {formatTime(booking.endAt)}
              </dd>
            </div>
            {service && (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">服務時長</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {formatDuration(service.durationMinutes)}
                </dd>
              </div>
            )}
          </dl>
        </Card>
      </div>

      {/* Assigned Resources */}
      <Card>
        <h3 className="text-sm font-medium text-gray-500 mb-2">指派資源</h3>
        {booking.assignedResourceIds.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {booking.assignedResourceIds.map((rid) => {
              const res = resources.find((r) => r.id === rid);
              return res ? (
                <ResourceBadge key={rid} type={res.type} name={res.name} />
              ) : (
                <span key={rid} className="text-xs text-gray-400">{rid}</span>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400">無指派資源</p>
        )}
      </Card>

      {/* Admin Actions */}
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">管理操作</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Status update */}
          <div className="space-y-3">
            <Select
              label="訂單狀態"
              options={bookingStatuses}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            />
            <Button
              onClick={handleUpdateStatus}
              loading={statusLoading}
              disabled={newStatus === booking.status}
              size="sm"
            >
              更新狀態
            </Button>
          </div>

          {/* Payment update */}
          <div className="space-y-3">
            <Select
              label="付款狀態"
              options={paymentStatuses}
              value={newPaymentStatus}
              onChange={(e) => setNewPaymentStatus(e.target.value)}
            />
            <Button
              onClick={handleUpdatePayment}
              loading={paymentLoading}
              disabled={newPaymentStatus === booking.paymentStatus}
              size="sm"
            >
              更新付款狀態
            </Button>
          </div>
        </div>

        {/* Refund */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <Button
            variant="danger"
            onClick={handleRefund}
            loading={refundLoading}
            disabled={booking.paymentStatus === 'refunded' && booking.status === 'cancelled'}
          >
            退款 (取消訂單並退款)
          </Button>
        </div>
      </Card>
    </div>
  );
}
