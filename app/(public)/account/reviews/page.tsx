'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { getCurrentUser } from '@/lib/auth';
import { getReviews, getGroomers } from '@/lib/api';
import { formatRating, formatDate } from '@/lib/format';
import type { Review, Groomer } from '@/types';

export default function AccountReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [groomers, setGroomers] = useState<Groomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;

    async function load() {
      try {
        setLoading(true);
        const user = getCurrentUser()!;
        const [allReviews, grmrs] = await Promise.all([
          getReviews(),
          getGroomers(),
        ]);

        // Filter reviews by the current user's name
        const myReviews = allReviews.filter(
          (r) => r.customerName === user.name,
        );
        setReviews(myReviews);
        setGroomers(grmrs);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [authChecked]);

  const getGroomerName = (groomerId: string) => {
    const groomer = groomers.find((g) => g.id === groomerId);
    return groomer?.displayName ?? '未知美容師';
  };

  if (!authChecked) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">我的評價</h1>
        <p className="mt-1 text-gray-500">查看你留下的所有評價</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rect" height={120} />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          title="尚無評價"
          description="完成預約後，你可以對美容師留下評價。"
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      美容師：{getGroomerName(review.groomerId)}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-4 w-4 ${
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
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatRating(review.rating)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
