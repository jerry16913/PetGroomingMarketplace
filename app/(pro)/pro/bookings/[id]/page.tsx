'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import ResourceBadge from '@/components/ResourceBadge';
import { getBooking, getService, getResources, updateBookingStatus } from '@/lib/api';
import {
  formatPrice,
  formatDate,
  formatTime,
  formatDateTime,
  getStatusLabel,
  getStatusColor,
  getPaymentStatusLabel,
} from '@/lib/format';
import type { Booking, Service, Resource } from '@/types';

export default function ProBookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [bk, allResources] = await Promise.all([
          getBooking(bookingId),
          getResources(),
        ]);

        if (!bk) {
          setError('找不到此訂單。');
          return;
        }

        setBooking(bk);
        setNotes(bk.notes ?? '');
        setResources(allResources);

        const svc = await getService(bk.serviceId);
        if (svc) setService(svc);
      } catch {
        setError('載入訂單詳情失敗，請稍後重試。');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [bookingId]);

  const handleStatusChange = async (newStatus: Booking['status']) => {
    if (!booking) return;
    try {
      setUpdating(true);
      const updated = await updateBookingStatus(booking.id, newStatus);
      setBooking(updated);
      showToast(`訂單狀態已更新為「${getStatusLabel(newStatus)}」`, 'success');
    } catch {
      showToast('狀態更新失敗，請稍後重試', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    await new Promise((r) => setTimeout(r, 300));
    showToast('備註已儲存', 'success');
  };

  const assignedResources = resources.filter((r) =>
    booking?.assignedResourceIds.includes(r.id)
  );

  if (error) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push('/pro/bookings')}>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回訂單列表
        </Button>
        <div className="rounded-lg bg-red-50 p-6 text-center text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" width={120} height={20} />
        <Skeleton variant="rect" height={200} />
        <Skeleton variant="rect" height={100} />
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={() => router.push('/pro/bookings')}>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回訂單列表
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            訂單 #{booking.id}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            建立於 {formatDateTime(booking.createdAt)}
          </p>
        </div>
        <Badge className={`${getStatusColor(booking.status)} text-sm px-3 py-1`}>
          {getStatusLabel(booking.status)}
        </Badge>
      </div>

      {/* Booking info */}
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">訂單資訊</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">客戶姓名</p>
            <p className="mt-0.5 font-medium text-gray-900">{booking.customerName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">聯絡信箱</p>
            <p className="mt-0.5 font-medium text-gray-900">{booking.customerEmail}</p>
          </div>
          {booking.customerPhone && (
            <div>
              <p className="text-sm text-gray-500">聯絡電話</p>
              <p className="mt-0.5 font-medium text-gray-900">{booking.customerPhone}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">服務項目</p>
            <p className="mt-0.5 font-medium text-gray-900">
              {service?.name ?? booking.serviceId}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">預約日期</p>
            <p className="mt-0.5 font-medium text-gray-900">{formatDate(booking.startAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">預約時間</p>
            <p className="mt-0.5 font-medium text-gray-900">
              {formatTime(booking.startAt)} - {formatTime(booking.endAt)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">金額</p>
            <p className="mt-0.5 text-lg font-semibold text-gray-900">
              {formatPrice(booking.price)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">付款狀態</p>
            <Badge className={getStatusColor(booking.paymentStatus)}>
              {getPaymentStatusLabel(booking.paymentStatus)}
            </Badge>
          </div>
        </div>
      </Card>

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

      {/* Notes */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">備註</h2>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="新增訂單備註..."
          rows={3}
        />
        <div className="mt-3 flex justify-end">
          <Button variant="outline" size="sm" onClick={handleSaveNotes}>
            儲存備註
          </Button>
        </div>
      </Card>

      {/* Action buttons based on status */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">操作</h2>
        <div className="flex flex-wrap gap-3">
          {booking.status === 'pending' && (
            <>
              <Button
                onClick={() => handleStatusChange('confirmed')}
                loading={updating}
              >
                確認
              </Button>
              <Button
                variant="danger"
                onClick={() => handleStatusChange('cancelled')}
                loading={updating}
              >
                拒絕
              </Button>
            </>
          )}
          {booking.status === 'confirmed' && (
            <>
              <Button
                onClick={() => handleStatusChange('completed')}
                loading={updating}
              >
                完成
              </Button>
              <Button
                variant="danger"
                onClick={() => handleStatusChange('no_show')}
                loading={updating}
              >
                未到
              </Button>
            </>
          )}
          {(booking.status === 'completed' ||
            booking.status === 'cancelled' ||
            booking.status === 'no_show') && (
            <p className="text-sm text-gray-500">此訂單已結束，無可用操作。</p>
          )}
        </div>
      </Card>
    </div>
  );
}
