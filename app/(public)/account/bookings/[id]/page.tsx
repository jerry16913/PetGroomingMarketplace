'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import ResourceBadge from '@/components/ResourceBadge';
import { getCurrentUser } from '@/lib/auth';
import {
  getBooking,
  getGroomer,
  getService,
  getResources,
  updateBookingStatus,
  createReview,
  getReviews,
} from '@/lib/api';
import {
  formatDateTime,
  formatPrice,
  formatDuration,
  getStatusLabel,
  getStatusColor,
} from '@/lib/format';
import type { Booking, Groomer, Service, Review, Resource } from '@/types';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [groomer, setGroomer] = useState<Groomer | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/auth/login');
      return;
    }

    async function load() {
      try {
        setLoading(true);
        const b = await getBooking(bookingId);
        if (!b) {
          setError('找不到此預約。');
          return;
        }
        setBooking(b);

        const [grm, svc, reviews, allResources] = await Promise.all([
          getGroomer(b.groomerId),
          getService(b.serviceId),
          getReviews(b.groomerId),
          getResources(),
        ]);
        setGroomer(grm ?? null);
        setService(svc ?? null);
        setResources(allResources);

        // Check if a review exists for this booking
        const existing = reviews.find((r) => r.bookingId === b.id);
        setExistingReview(existing ?? null);
      } catch {
        setError('載入預約資料失敗。');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [bookingId, router]);

  const handleCancel = async () => {
    if (!booking) return;
    try {
      setCancelling(true);
      const updated = await updateBookingStatus(booking.id, 'cancelled');
      setBooking(updated);
      showToast('預約已取消', 'info');
    } catch {
      showToast('取消預約失敗', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!booking) return;
    if (!reviewComment.trim()) {
      showToast('請填寫評價內容', 'error');
      return;
    }

    try {
      setSubmittingReview(true);
      const user = getCurrentUser();
      const newReview = await createReview({
        bookingId: booking.id,
        groomerId: booking.groomerId,
        customerName: user?.name ?? booking.customerName,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setExistingReview(newReview);
      setReviewModalOpen(false);
      showToast('評價已送出，謝謝您！', 'success');
    } catch {
      showToast('送出評價失敗', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton variant="text" width="30%" height={28} className="mb-4" />
        <Skeleton variant="rect" height={300} />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-red-50 p-6 text-center text-red-600">
          {error ?? '找不到此預約。'}
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => router.push('/account/bookings')}>
            返回預約列表
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => router.push('/account/bookings')}
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        返回預約列表
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">預約詳情</h1>

      {/* Booking Detail Card */}
      <Card className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">狀態</span>
            <Badge className={getStatusColor(booking.status)}>
              {getStatusLabel(booking.status)}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">美容師</span>
            <span className="text-sm font-medium text-gray-900">
              {groomer?.displayName ?? '-'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">服務</span>
            <span className="text-sm font-medium text-gray-900">
              {service?.name ?? '-'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">開始時間</span>
            <span className="text-sm font-medium text-gray-900">
              {formatDateTime(booking.startAt)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">結束時間</span>
            <span className="text-sm font-medium text-gray-900">
              {formatDateTime(booking.endAt)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">時長</span>
            <span className="text-sm font-medium text-gray-900">
              {service
                ? formatDuration(service.durationMinutes)
                : '-'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">客戶姓名</span>
            <span className="text-sm font-medium text-gray-900">
              {booking.customerName}
            </span>
          </div>
          {booking.customerPhone && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">電話</span>
              <span className="text-sm font-medium text-gray-900">
                {booking.customerPhone}
              </span>
            </div>
          )}
          {booking.notes && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">備註</span>
              <span className="text-sm text-gray-700">{booking.notes}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-4 flex justify-between">
            <span className="text-base font-semibold text-gray-900">費用</span>
            <span className="text-base font-semibold text-blue-600">
              {formatPrice(booking.price)}
            </span>
          </div>
        </div>
      </Card>

      {/* Assigned Resources */}
      <div className="mb-6">
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
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {booking.status === 'confirmed' && (
          <Button
            variant="danger"
            onClick={handleCancel}
            loading={cancelling}
          >
            取消預約
          </Button>
        )}
        {booking.status === 'completed' && !existingReview && (
          <Button onClick={() => setReviewModalOpen(true)}>留下評價</Button>
        )}
        {existingReview && (
          <Card className="w-full mt-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              你的評價
            </h3>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`h-4 w-4 ${
                    star <= existingReview.rating
                      ? 'text-yellow-400'
                      : 'text-gray-200'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-gray-600">{existingReview.comment}</p>
          </Card>
        )}
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="留下評價"
      >
        <div className="space-y-4">
          {/* Star Rating */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              評分
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="p-0.5 transition-transform hover:scale-110"
                >
                  <svg
                    className={`h-8 w-8 ${
                      star <= reviewRating
                        ? 'text-yellow-400'
                        : 'text-gray-200'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {reviewRating} / 5
              </span>
            </div>
          </div>

          {/* Comment */}
          <Textarea
            label="評價內容"
            required
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="分享你的體驗..."
            rows={4}
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setReviewModalOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmitReview} loading={submittingReview}>
              送出評價
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
