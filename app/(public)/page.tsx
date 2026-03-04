'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import GroomerCard from '@/components/GroomerCard';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { getGroomers, getServices } from '@/lib/api';
import type { Groomer, Service } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [groomers, setGroomers] = useState<Groomer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [grmrs, svcs] = await Promise.all([
          getGroomers({ sort: 'rating' }),
          getServices(),
        ]);
        setGroomers(grmrs.filter((g) => g.status === 'approved').slice(0, 4));
        setServices(svcs);
      } catch (err) {
        setError('載入資料失敗，請稍後重試。');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSearch = useCallback(
    (term: string) => {
      if (term) {
        router.push(`/groomers?search=${encodeURIComponent(term)}`);
      }
    },
    [router],
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              找到最適合你毛孩的寵物美容師
            </h1>
            <p className="mt-6 text-lg text-blue-100 sm:text-xl">
              瀏覽美容師作品、評價與價格，線上預約寵物美容服務。
            </p>
            <div className="mt-10 mx-auto max-w-lg">
              <SearchBar
                onSearch={handleSearch}
                placeholder="搜尋寵物美容師或服務..."
                className="[&_input]:border-white/30 [&_input]:bg-white/10 [&_input]:text-white [&_input]:placeholder:text-blue-200"
              />
            </div>
            <div className="mt-6">
              <Link href="/groomers">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50"
                >
                  立即預約
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* 搜尋寵物美容師 */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            搜尋寵物美容師
          </h2>
          <p className="mt-2 text-gray-500">依地區、評價或價格找到理想的美容師</p>
        </div>
        <div className="mt-10 mx-auto max-w-lg">
          <SearchBar
            onSearch={handleSearch}
            placeholder="輸入美容師名稱、地區..."
          />
        </div>
      </section>

      {/* 熱門寵物美容服務 */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                熱門寵物美容服務
              </h2>
              <p className="mt-2 text-gray-500">最受歡迎的寵物美容項目</p>
            </div>
            <Link href="/pet-services">
              <Button variant="outline" size="sm">
                查看全部
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="80%" className="mt-2" />
                    <Skeleton variant="text" width="40%" className="mt-2" />
                  </div>
                ))
              : services.slice(0, 3).map((svc) => (
                  <div key={svc.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-900">{svc.name}</h3>
                    {svc.description && (
                      <p className="mt-2 text-sm text-gray-500 line-clamp-2">{svc.description}</p>
                    )}
                    <p className="mt-3 text-sm font-medium text-blue-600">
                      NT${svc.basePrice} / {svc.durationMinutes} 分鐘
                    </p>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* 推薦美容師 */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                推薦美容師
              </h2>
              <p className="mt-2 text-gray-500">最受好評的寵物美容師</p>
            </div>
            <Link href="/groomers">
              <Button variant="outline" size="sm">
                查看全部
              </Button>
            </Link>
          </div>

          {error && (
            <div className="mt-8 rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
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
                ))
              : groomers.map((groomer) => (
                  <GroomerCard
                    key={groomer.id}
                    groomer={groomer}
                    services={services}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* 用戶評價 */}
      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              用戶評價
            </h2>
            <p className="mt-2 text-gray-500">看看飼主們怎麼說</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-600">美容師很細心，我家狗狗剪完超可愛！</p>
              <p className="mt-3 text-xs text-gray-400">- 王小明</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-600">預約流程簡單，美容師準時又專業。</p>
              <p className="mt-3 text-xs text-gray-400">- 李小花</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-600">價格透明合理，貓咪洗完香噴噴的！</p>
              <p className="mt-3 text-xs text-gray-400">- 張大華</p>
            </div>
          </div>
        </div>
      </section>

      {/* 成為美容師 CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 text-center text-white sm:px-16 sm:py-16">
          <h2 className="text-2xl font-bold sm:text-3xl">成為美容師</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
            加入我們的平台，展示你的寵物美容技術，接觸更多飼主客戶，提升你的事業。
          </p>
          <div className="mt-8">
            <Link href="/auth/register">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50"
              >
                立即加入
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
