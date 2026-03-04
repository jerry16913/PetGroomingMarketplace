'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BookingStepper from '@/components/BookingStepper';
import CalendarPicker from '@/components/CalendarPicker';
import TimeSlotPicker from '@/components/TimeSlotPicker';
import ResourceAutoAssignPanel from '@/components/ResourceAutoAssignPanel';
import type { ResourceAssignment } from '@/components/ResourceAutoAssignPanel';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { getGroomer, getServices, getPets, autoAssignResources } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { formatPrice, formatDuration } from '@/lib/format';
import type { Groomer, Service, Pet } from '@/types';

const STEPS = ['選美容師', '選服務', '選寵物', '選時間', '確認'];

// Generate time slots every 30 minutes from 09:00 to 18:00
function generateAllSlots(): string[] {
  const slots: string[] = [];
  for (let h = 9; h < 18; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  slots.push('18:00');
  return slots;
}

// Mock availability: remove some random slots based on date
function getAvailableSlots(date: string): string[] {
  const all = generateAllSlots();
  // Use date string to generate a deterministic "seed"
  const seed = date.split('-').reduce((sum, n) => sum + parseInt(n, 10), 0);
  return all.filter((_, i) => (i + seed) % 3 !== 0);
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><Skeleton variant="rect" height={300} /></div>}>
      <BookingContent />
    </Suspense>
  );
}

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const groomerIdParam = searchParams.get('groomerId') ?? '';
  const serviceIdParam = searchParams.get('serviceId') ?? '';

  const [currentStep, setCurrentStep] = useState(0);
  const [groomer, setGroomer] = useState<Groomer | null>(null);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Step state
  const [selectedServiceId, setSelectedServiceId] = useState(serviceIdParam);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Resource allocation state
  const [resourceAssignments, setResourceAssignments] = useState<ResourceAssignment[]>([]);
  const [resourceLoading, setResourceLoading] = useState(false);
  const [resourceError, setResourceError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const svcs = await getServices();
        setAllServices(svcs);

        // Load user's pets
        const user = getCurrentUser();
        if (user) {
          const userPets = await getPets(user.id);
          setPets(userPets);
        }

        if (groomerIdParam) {
          const g = await getGroomer(groomerIdParam);
          setGroomer(g ?? null);
        }

        // If we have both groomer and service from params, skip to step 2 (select pet)
        if (groomerIdParam && serviceIdParam) {
          setCurrentStep(2);
        } else if (groomerIdParam) {
          // If we only have groomer, skip to step 1 (select service)
          setCurrentStep(1);
        }
      } catch {
        setError('載入資料失敗，請稍後重試。');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [groomerIdParam, serviceIdParam]);

  // Resolve the selected service object
  const selectedService = allServices.find((s) => s.id === selectedServiceId);

  // Get services the groomer offers
  const groomerServices = groomer
    ? groomer.services
        .map((gs) => {
          const svc = allServices.find((s) => s.id === gs.serviceId);
          if (!svc) return null;
          return {
            ...svc,
            price: gs.priceOverride ?? svc.basePrice,
            duration: gs.durationOverride ?? svc.durationMinutes,
          };
        })
        .filter(Boolean) as (Service & { price: number; duration: number })[]
    : [];

  // Get available time slots for selected date
  const availableSlots = selectedDate ? getAvailableSlots(selectedDate) : [];

  // Auto-assign resources when reaching the confirmation step
  const fetchResourceAssignments = useCallback(async () => {
    if (!selectedDate || !selectedSlot || !selectedServiceId) return;

    const resolvedService = groomerServices.find((s) => s.id === selectedServiceId);
    const durationMinutes =
      resolvedService?.duration ?? selectedService?.durationMinutes ?? 0;

    const startAt = new Date(`${selectedDate}T${selectedSlot}:00`).toISOString();
    const endDate = new Date(`${selectedDate}T${selectedSlot}:00`);
    endDate.setMinutes(endDate.getMinutes() + durationMinutes);
    const endAt = endDate.toISOString();

    try {
      setResourceLoading(true);
      setResourceError('');
      const result = await autoAssignResources(selectedServiceId, startAt, endAt);
      setResourceAssignments(result.assignments);
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message === 'RESOURCE_UNAVAILABLE'
          ? '該時段資源已滿，請選擇其他時段'
          : '載入資源分配失敗，請重試';
      setResourceError(message);
      setResourceAssignments([]);
    } finally {
      setResourceLoading(false);
    }
  }, [selectedDate, selectedSlot, selectedServiceId, groomerServices, selectedService]);

  useEffect(() => {
    if (currentStep === 4) {
      fetchResourceAssignments();
    }
  }, [currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  const canGoNext = () => {
    switch (currentStep) {
      case 0:
        return !!groomer;
      case 1:
        return !!selectedServiceId;
      case 2:
        return !!selectedPetId;
      case 3:
        return !!selectedDate && !!selectedSlot;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 4) {
      // Navigate to confirm page with all data
      const resolvedService = groomerServices.find(
        (s) => s.id === selectedServiceId,
      );
      const params = new URLSearchParams({
        groomerId: groomer?.id ?? '',
        groomerName: groomer?.displayName ?? '',
        serviceId: selectedServiceId,
        serviceName: resolvedService?.name ?? selectedService?.name ?? '',
        petId: selectedPetId ?? '',
        petName: pets.find((p) => p.id === selectedPetId)?.name ?? '',
        date: selectedDate ?? '',
        time: selectedSlot ?? '',
        price: String(
          resolvedService?.price ?? selectedService?.basePrice ?? 0,
        ),
        duration: String(
          resolvedService?.duration ?? selectedService?.durationMinutes ?? 0,
        ),
      });
      // Append assigned resource IDs
      const assignedResourceIds = resourceAssignments
        .map((a) => a.resourceId)
        .join(',');
      if (assignedResourceIds) {
        params.set('assignedResourceIds', assignedResourceIds);
      }
      router.push(`/booking/confirm?${params.toString()}`);
      return;
    }
    if (canGoNext()) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton variant="rect" height={60} className="mb-8" />
        <Skeleton variant="rect" height={300} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-lg bg-red-50 p-6 text-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!groomer) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-lg bg-yellow-50 p-6 text-center text-yellow-700">
          請從美容師頁面選擇要預約的美容師。
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">預約服務</h1>
        <p className="mt-1 text-sm text-gray-500">
          美容師：{groomer.displayName}
        </p>
      </div>

      {/* Stepper */}
      <BookingStepper currentStep={currentStep} steps={STEPS} className="mb-8" />

      {/* Step Content */}
      <div className="mb-8">
        {/* Step 0: Groomer selected (info display) */}
        {currentStep === 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              選擇美容師
            </h2>
            <Card className="ring-2 ring-[#4884B8] border-[#4884B8]">
              <div className="flex items-center gap-4">
                <img
                  src={groomer.avatarUrl}
                  alt={groomer.displayName}
                  className="h-14 w-14 rounded-full object-cover bg-gray-100"
                />
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {groomer.displayName}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{groomer.bio}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Step 1: Select Service */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              選擇服務
            </h2>
            <div className="space-y-3">
              {groomerServices.map((svc) => (
                <Card
                  key={svc.id}
                  hover
                  onClick={() => setSelectedServiceId(svc.id)}
                  className={
                    selectedServiceId === svc.id
                      ? 'ring-2 ring-[#4884B8] border-[#4884B8]'
                      : ''
                  }
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        {svc.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {svc.description}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatDuration(svc.duration)}
                      </p>
                    </div>
                    <span className="ml-4 text-base font-semibold text-gray-900 whitespace-nowrap">
                      {formatPrice(svc.price)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Pet */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              選擇寵物
            </h2>
            {pets.length === 0 ? (
              <div className="rounded-lg bg-yellow-50 p-6 text-center">
                <p className="text-sm text-yellow-700 mb-4">
                  您尚未新增任何寵物，請先至寵物管理頁面新增寵物資料。
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/account/pets')}
                >
                  前往新增寵物
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {pets.map((pet) => (
                  <Card
                    key={pet.id}
                    hover
                    onClick={() => setSelectedPetId(pet.id)}
                    className={
                      selectedPetId === pet.id
                        ? 'ring-2 ring-[#4884B8] border-[#4884B8]'
                        : ''
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DBEAF5] text-2xl">
                        🐾
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">
                          {pet.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {pet.breed} / {pet.weight}kg
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Select Date & Time */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              選擇日期與時段
            </h2>
            <div className="flex justify-center mb-6">
              <CalendarPicker
                selectedDate={selectedDate}
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  setSelectedSlot(null); // Reset slot when date changes
                }}
              />
            </div>
            {selectedDate && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  選擇時段
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  日期：{selectedDate}
                </p>
                <TimeSlotPicker
                  slots={availableSlots}
                  selectedSlot={selectedSlot}
                  onSlotSelect={setSelectedSlot}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 4: Confirmation Summary */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              確認預約資訊
            </h2>
            <Card>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">美容師</span>
                  <span className="text-sm font-medium text-gray-900">
                    {groomer.displayName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">服務</span>
                  <span className="text-sm font-medium text-gray-900">
                    {groomerServices.find((s) => s.id === selectedServiceId)?.name ??
                      selectedService?.name ??
                      '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">寵物</span>
                  <span className="text-sm font-medium text-gray-900">
                    {pets.find((p) => p.id === selectedPetId)?.name ?? '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">日期</span>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedDate ?? '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">時段</span>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedSlot ?? '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">時長</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDuration(
                      groomerServices.find((s) => s.id === selectedServiceId)
                        ?.duration ??
                        selectedService?.durationMinutes ??
                        0,
                    )}
                  </span>
                </div>

                {/* Resource Assignments */}
                {resourceAssignments.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <span className="text-sm text-gray-500 block mb-2">
                      分配資源
                    </span>
                    <ResourceAutoAssignPanel assignments={resourceAssignments} />
                  </div>
                )}

                {resourceError && (
                  <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                    {resourceError}
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="text-base font-semibold text-gray-900">
                    費用
                  </span>
                  <span className="text-base font-semibold text-[#4884B8]">
                    {formatPrice(
                      groomerServices.find((s) => s.id === selectedServiceId)
                        ?.price ??
                        selectedService?.basePrice ??
                        0,
                    )}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          上一步
        </Button>
        <Button onClick={handleNext} disabled={!canGoNext()}>
          {currentStep === 4 ? '前往確認' : '下一步'}
        </Button>
      </div>
    </div>
  );
}
