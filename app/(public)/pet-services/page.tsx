'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Skeleton from '@/components/ui/Skeleton';
import Card from '@/components/ui/Card';
import { getServices } from '@/lib/api';
import { formatPrice, formatDuration } from '@/lib/format';
import type { Service } from '@/types';

export default function PetServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const svcs = await getServices();
        setServices(svcs);
      } catch {
        setError('載入服務資料失敗，請稍後重試。');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-lg bg-red-50 p-6 text-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">寵物美容服務</h1>
        <p className="mt-2 text-gray-500">
          瀏覽所有可預約的寵物美容服務項目
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rect" height={160} />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="py-12 text-center text-gray-500">暫無服務項目</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const truncatedDescription =
              service.description.length > 80
                ? service.description.slice(0, 80) + '...'
                : service.description;

            return (
              <Card key={service.id} hover>
                <div className="flex flex-col gap-3">
                  {/* Header */}
                  <h3 className="text-base font-semibold text-gray-900">
                    {service.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {truncatedDescription}
                  </p>

                  {/* Duration and price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{formatDuration(service.durationMinutes)}</span>
                    </div>
                    <span className="text-base font-semibold text-gray-900">
                      {formatPrice(service.basePrice)}
                    </span>
                  </div>

                  {/* CTA -- link to groomers */}
                  <Link
                    href={`/groomers?service=${service.id}`}
                    className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-[#4884B8] hover:text-[#4884B8] transition-colors"
                  >
                    瀏覽美容師
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
