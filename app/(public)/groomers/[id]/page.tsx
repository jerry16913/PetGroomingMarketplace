'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Tabs from '@/components/ui/Tabs';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import ReviewList from '@/components/ReviewList';
import Card from '@/components/ui/Card';
import { getGroomer, getServices, getReviews } from '@/lib/api';
import { formatPrice, formatDuration, formatRating } from '@/lib/format';
import type { Groomer, Service, Review } from '@/types';

const TABS = [
  { key: 'services', label: '服務' },
  { key: 'portfolio', label: '作品集' },
  { key: 'reviews', label: '評價' },
];

export default function GroomerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [groomer, setGroomer] = useState<Groomer | null>(null);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState('services');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [g, svcs, revs] = await Promise.all([
          getGroomer(id),
          getServices(),
          getReviews(id),
        ]);
        if (!g) {
          setError('找不到此美容師。');
          return;
        }
        setGroomer(g);
        setAllServices(svcs);
        setReviews(revs);
      } catch {
        setError('載入美容師資料失敗，請稍後重試。');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-start gap-6">
          <Skeleton variant="circle" width={96} height={96} />
          <div className="flex-1 space-y-3">
            <Skeleton variant="text" width="40%" height={28} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="80%" />
          </div>
        </div>
        <Skeleton variant="rect" height={48} className="mt-8" />
        <div className="mt-6 space-y-4">
          <Skeleton variant="rect" height={80} />
          <Skeleton variant="rect" height={80} />
          <Skeleton variant="rect" height={80} />
        </div>
      </div>
    );
  }

  if (error || !groomer) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-red-50 p-6 text-center text-red-600">
          {error || '找不到此美容師。'}
        </div>
        <div className="mt-6 text-center">
          <Link href="/groomers">
            <Button variant="outline">返回美容師列表</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Map groomer services with full service details
  const groomerServices = groomer.services
    .map((gs) => {
      const svc = allServices.find((s) => s.id === gs.serviceId);
      if (!svc) return null;
      return {
        ...svc,
        price: gs.priceOverride ?? svc.basePrice,
        duration: gs.durationOverride ?? svc.durationMinutes,
      };
    })
    .filter(Boolean) as (Service & { price: number; duration: number })[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Groomer Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <img
          src={groomer.avatarUrl}
          alt={groomer.displayName}
          className="h-24 w-24 rounded-full bg-gray-200 object-cover"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {groomer.displayName}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`h-5 w-5 ${
                    groomer.ratingAvg >= star
                      ? 'text-yellow-400'
                      : groomer.ratingAvg >= star - 0.5
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
            <span className="text-sm text-gray-500">
              {formatRating(groomer.ratingAvg)} ({groomer.ratingCount}{' '}
              則評價)
            </span>
          </div>
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            {groomer.bio}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'services' && (
          <div className="space-y-4">
            {groomerServices.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                暫無服務項目
              </p>
            ) : (
              groomerServices.map((svc) => (
                <Card key={svc.id}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900">
                        {svc.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {svc.description}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
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
                          {formatDuration(svc.duration)}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatPrice(svc.price)}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/booking?groomerId=${groomer.id}&serviceId=${svc.id}`}
                    >
                      <Button size="sm">預約</Button>
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
            {groomer.portfolio.length === 0 ? (
              <p className="col-span-full py-8 text-center text-sm text-gray-500">
                暫無作品集
              </p>
            ) : (
              groomer.portfolio.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-gray-200"
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <span className="text-4xl text-gray-300">📷</span>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-gray-600">{item.caption}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'reviews' && <ReviewList reviews={reviews} />}
      </div>
    </div>
  );
}
