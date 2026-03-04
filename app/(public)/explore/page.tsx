'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import GroomerCard from '@/components/GroomerCard';
import ServiceCard from '@/components/ServiceCard';
import Skeleton from '@/components/ui/Skeleton';
import Card from '@/components/ui/Card';
import { formatRating, formatDate } from '@/lib/format';
import { getServices, getReviews, getGroomers } from '@/lib/api';
import type { Service, Review, Groomer } from '@/types';

export default function ExplorePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [groomers, setGroomers] = useState<Groomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [svcs, revs, grmrs] = await Promise.all([
          getServices(),
          getReviews(),
          getGroomers(),
        ]);
        setServices(svcs);
        setReviews(revs);
        setGroomers(grmrs.filter((g) => g.status === 'approved'));
      } catch {
        setError('載入資料失敗，請稍後重試。');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // Filter groomers by search term
  const filteredGroomers = searchTerm
    ? groomers.filter((g) =>
        g.displayName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : groomers;

  // Top 6 trending services (by lowest price to make it interesting)
  const trendingServices = services.slice(0, 6);

  // Top 6 reviews with high ratings
  const featuredReviews = [...reviews]
    .filter((r) => r.rating >= 4)
    .sort((a, b) => b.rating - a.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const getGroomerName = (groomerId: string) => {
    const groomer = groomers.find((g) => g.id === groomerId);
    return groomer?.displayName ?? '未知美容師';
  };

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
        <h1 className="text-3xl font-bold text-gray-900">探索</h1>
        <p className="mt-2 text-gray-500">瀏覽寵物美容服務與精選評價</p>
      </div>

      {/* Search Bar */}
      <SearchBar
        onSearch={handleSearch}
        placeholder="搜尋美容師名稱..."
        className="mb-8"
      />

      {/* Groomers Grid */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">推薦美容師</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} variant="rect" height={280} />
            ))}
          </div>
        ) : filteredGroomers.length === 0 ? (
          <div className="py-12 text-center text-gray-500">找不到符合的美容師</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGroomers.map((groomer) => (
              <GroomerCard
                key={groomer.id}
                groomer={groomer}
                services={services}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trending Services */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">熱門寵物美容服務</h2>
          <Link
            href="/pet-services"
            className="text-sm font-medium text-[#4884B8] hover:text-[#3D77AB] transition-colors"
          >
            查看全部
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rect" height={160} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingServices.map((svc) => (
              <ServiceCard
                key={svc.id}
                service={svc}
              />
            ))}
          </div>
        )}
      </section>

      {/* Featured Reviews */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">精選評價</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rect" height={140} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredReviews.map((review) => (
              <Card key={review.id}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                        {review.customerName.charAt(0)}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {review.customerName}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`h-3.5 w-3.5 ${
                                star <= review.rating
                                  ? 'text-yellow-400'
                                  : 'text-gray-200'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-1 text-xs text-gray-500">
                            {formatRating(review.rating)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {review.comment}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    美容師：{getGroomerName(review.groomerId)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
