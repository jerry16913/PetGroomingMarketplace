'use client';

import React, { useEffect, useState } from 'react';
import type { Review, Groomer } from '@/types';
import { getReviews, getGroomers } from '@/lib/api';
import { formatRating, formatDate } from '@/lib/format';
import DataTable from '@/components/ui/DataTable';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';

export default function AdminReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [groomers, setGroomers] = useState<Groomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [minRating, setMinRating] = useState('');
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      try {
        const [revs, grmrs] = await Promise.all([getReviews(), getGroomers()]);
        setReviews(revs);
        setGroomers(grmrs);
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入資料失敗');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleHide = (reviewId: string) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      if (next.has(reviewId)) {
        next.delete(reviewId);
        showToast('評價已顯示', 'info');
      } else {
        next.add(reviewId);
        showToast('評價已隱藏', 'success');
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">評價管理</h1>
        <Skeleton variant="rect" height={400} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const groomerMap = new Map(groomers.map((g) => [g.id, g.displayName]));

  const ratingFilterOptions = [
    { value: '', label: '全部評分' },
    { value: '5', label: '5 星' },
    { value: '4', label: '4 星以上' },
    { value: '3', label: '3 星以上' },
    { value: '2', label: '2 星以上' },
    { value: '1', label: '1 星以上' },
  ];

  // Apply filters: minRating and hidden
  let filtered = reviews.filter((r) => !hiddenIds.has(r.id));
  if (minRating) {
    const min = parseInt(minRating, 10);
    filtered = filtered.filter((r) => r.rating >= min);
  }

  // Sort by date desc
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const columns = [
    {
      key: 'customerName',
      label: '顧客',
      render: (row: Record<string, unknown>) => (
        <span className="font-medium text-gray-900">{row.customerName as string}</span>
      ),
    },
    {
      key: 'groomer',
      label: '美容師',
      render: (row: Record<string, unknown>) =>
        groomerMap.get(row.groomerId as string) ?? '-',
    },
    {
      key: 'rating',
      label: '評分',
      render: (row: Record<string, unknown>) => {
        const rating = row.rating as number;
        return (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`h-4 w-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 text-sm text-gray-500">{formatRating(rating)}</span>
          </div>
        );
      },
    },
    {
      key: 'comment',
      label: '評論',
      render: (row: Record<string, unknown>) => {
        const comment = row.comment as string;
        return (
          <span className="text-sm text-gray-600" title={comment}>
            {comment.length > 40 ? `${comment.slice(0, 40)}...` : comment}
          </span>
        );
      },
    },
    {
      key: 'createdAt',
      label: '日期',
      render: (row: Record<string, unknown>) => formatDate(row.createdAt as string),
    },
    {
      key: 'actions',
      label: '操作',
      render: (row: Record<string, unknown>) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            toggleHide(row.id as string);
          }}
        >
          隱藏
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">評價管理</h1>
        {hiddenIds.size > 0 && (
          <span className="text-sm text-gray-500">已隱藏 {hiddenIds.size} 則評價</span>
        )}
      </div>

      {/* Filter */}
      <div className="max-w-xs">
        <Select
          label="最低評分"
          options={ratingFilterOptions}
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={sorted as unknown as Record<string, unknown>[]}
        emptyMessage="沒有符合條件的評價"
      />
    </div>
  );
}
