'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import FilterBar from '@/components/FilterBar';
import type { FilterValues } from '@/components/FilterBar';
import GroomerCard from '@/components/GroomerCard';
import Skeleton from '@/components/ui/Skeleton';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import { getGroomers, getServices } from '@/lib/api';
import type { Groomer, Service } from '@/types';

const PAGE_SIZE = 8;

export default function GroomersPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10"><Skeleton variant="rect" height={400} /></div>}>
      <GroomersContent />
    </Suspense>
  );
}

function GroomersContent() {
  const searchParams = useSearchParams();
  const serviceFromUrl = searchParams.get('service') ?? '';

  const [groomers, setGroomers] = useState<Groomer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterValues>({});

  // Load services on mount
  useEffect(() => {
    async function loadStatic() {
      try {
        const svcs = await getServices();
        setServices(svcs);
      } catch {
        // silently fail, will show empty
      }
    }
    loadStatic();
  }, []);

  // Load groomers whenever filters change
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const apiFilters: {
          minRating?: number;
          minPrice?: number;
          maxPrice?: number;
          sort?: 'rating' | 'price_asc' | 'price_desc';
        } = {};
        if (filters.minRating) apiFilters.minRating = filters.minRating;
        if (filters.minPrice) apiFilters.minPrice = filters.minPrice;
        if (filters.maxPrice) apiFilters.maxPrice = filters.maxPrice;
        if (filters.sort) {
          const sortMap: Record<string, 'rating' | 'price_asc' | 'price_desc'> = {
            rating_desc: 'rating',
            price_asc: 'price_asc',
            price_desc: 'price_desc',
          };
          if (sortMap[filters.sort]) apiFilters.sort = sortMap[filters.sort];
        }

        const list = await getGroomers(apiFilters);
        setGroomers(list.filter((g) => g.status === 'approved'));
        setCurrentPage(1);
      } catch {
        setError('載入美容師資料失敗，請稍後重試。');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filters]);

  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
  }, []);

  const totalPages = Math.ceil(groomers.length / PAGE_SIZE);
  const paginatedGroomers = groomers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">尋找寵物美容師</h1>
        <p className="mt-2 text-gray-500">
          瀏覽所有寵物美容師，使用篩選找到最適合你的服務
        </p>
      </div>

      {/* Filter Bar — no category filter (pet grooming only) */}
      <FilterBar
        onFilterChange={handleFilterChange}
        className="mb-8"
      />

      {error && (
        <div className="mb-8 rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Groomers Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <div className="flex items-start gap-4">
                <Skeleton variant="circle" width={56} height={56} />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="80%" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton variant="text" />
                <Skeleton variant="text" width="50%" />
              </div>
              <Skeleton variant="rect" height={36} className="mt-4" />
            </div>
          ))}
        </div>
      ) : paginatedGroomers.length === 0 ? (
        <EmptyState
          title="找不到符合條件的美容師"
          description="請嘗試調整篩選條件"
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedGroomers.map((groomer) => (
              <GroomerCard
                key={groomer.id}
                groomer={groomer}
                services={services}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
