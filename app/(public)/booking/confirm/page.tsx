'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import ResourceBadge from '@/components/ResourceBadge';
import { createBooking, getResources, getPet } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { formatPrice, formatDuration } from '@/lib/format';
import type { Resource, Pet } from '@/types';

export default function BookingConfirmPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><Skeleton variant="rect" height={300} /></div>}>
      <BookingConfirmContent />
    </Suspense>
  );
}

function BookingConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const groomerId = searchParams.get('groomerId') ?? '';
  const groomerName = searchParams.get('groomerName') ?? '';
  const serviceId = searchParams.get('serviceId') ?? '';
  const serviceName = searchParams.get('serviceName') ?? '';
  const petIdParam = searchParams.get('petId') ?? '';
  const petNameParam = searchParams.get('petName') ?? '';
  const date = searchParams.get('date') ?? '';
  const time = searchParams.get('time') ?? '';
  const price = Number(searchParams.get('price') ?? '0');
  const duration = Number(searchParams.get('duration') ?? '0');
  const assignedResourceIdsParam = searchParams.get('assignedResourceIds') ?? '';
  const assignedResourceIds = assignedResourceIdsParam
    ? assignedResourceIdsParam.split(',')
    : [];

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [assignedResources, setAssignedResources] = useState<Resource[]>([]);
  const [pet, setPet] = useState<Pet | null>(null);

  // Pre-fill if logged in
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCustomerName(user.name);
    }
  }, []);

  // Load pet info
  useEffect(() => {
    if (!petIdParam) return;
    async function loadPet() {
      try {
        const p = await getPet(petIdParam);
        if (p) setPet(p);
      } catch {
        // Silently fail
      }
    }
    loadPet();
  }, [petIdParam]);

  // Load resources to resolve IDs to names
  useEffect(() => {
    if (assignedResourceIds.length === 0) return;

    async function loadResources() {
      try {
        const allResources = await getResources();
        const matched = allResources.filter((r) =>
          assignedResourceIds.includes(r.id),
        );
        setAssignedResources(matched);
      } catch {
        // Silently fail — resource display is supplementary
      }
    }
    loadResources();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async () => {
    if (!customerName.trim()) {
      showToast('請填寫姓名', 'error');
      return;
    }
    if (!customerPhone.trim()) {
      showToast('請填寫電話', 'error');
      return;
    }

    try {
      setSubmitting(true);

      // Build start/end timestamps
      const startAt = new Date(`${date}T${time}:00`).toISOString();
      const endDate = new Date(`${date}T${time}:00`);
      endDate.setMinutes(endDate.getMinutes() + duration);
      const endAt = endDate.toISOString();

      const user = getCurrentUser();

      await createBooking({
        customerName: customerName.trim(),
        customerEmail: user?.email ?? 'guest@example.com',
        customerPhone: customerPhone.trim(),
        groomerId,
        serviceId,
        petId: petIdParam || undefined,
        startAt,
        endAt,
        price,
        status: 'pending',
        paymentStatus: 'unpaid',
        assignedResourceIds,
      });

      showToast('預約成功！', 'success');
      router.push('/account/bookings');
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'RESOURCE_UNAVAILABLE') {
        showToast('該時段資源已滿，請換時段', 'error');
      } else {
        showToast('預約失敗，請稍後重試。', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Validate that we have the required params
  if (!groomerId || !serviceId || !date || !time) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-lg bg-yellow-50 p-6 text-center text-yellow-700">
          缺少預約資訊，請重新操作。
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => router.push('/groomers')}>
            瀏覽美容師
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">確認預約</h1>

      {/* Booking Summary */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          預約摘要
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">美容師</span>
            <span className="text-sm font-medium text-gray-900">
              {groomerName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">服務</span>
            <span className="text-sm font-medium text-gray-900">
              {serviceName}
            </span>
          </div>

          {/* Pet Info */}
          {(pet || petNameParam) && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">寵物</span>
              <span className="text-sm font-medium text-gray-900">
                {pet ? `${pet.name} (${pet.breed}, ${pet.weight}kg)` : petNameParam}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-sm text-gray-500">日期</span>
            <span className="text-sm font-medium text-gray-900">{date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">時段</span>
            <span className="text-sm font-medium text-gray-900">{time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">時長</span>
            <span className="text-sm font-medium text-gray-900">
              {formatDuration(duration)}
            </span>
          </div>

          {/* Assigned Resources */}
          {assignedResources.length > 0 && (
            <div className="border-t border-gray-200 pt-3">
              <span className="text-sm text-gray-500 block mb-2">
                分配資源
              </span>
              <div className="flex flex-wrap gap-2">
                {assignedResources.map((resource) => (
                  <ResourceBadge
                    key={resource.id}
                    type={resource.type}
                    name={resource.name}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-3 flex justify-between">
            <span className="text-base font-semibold text-gray-900">
              費用
            </span>
            <span className="text-base font-semibold text-[#4884B8]">
              {formatPrice(price)}
            </span>
          </div>
        </div>
      </Card>

      {/* Customer Info Form */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          聯絡資訊
        </h2>
        <div className="space-y-4">
          <Input
            label="姓名"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="請輸入姓名"
          />
          <Input
            label="電話"
            required
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="例：0912-345-678"
          />
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          返回
        </Button>
        <Button onClick={handleSubmit} loading={submitting}>
          確認付款
        </Button>
      </div>
    </div>
  );
}
