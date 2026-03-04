'use client';

import React, { useEffect, useState } from 'react';
import type { Category } from '@/types';
import { getCategories } from '@/lib/api';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入資料失敗');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">服務分類</h1>
        <Skeleton variant="rect" height={200} />
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">服務分類</h1>
        <p className="mt-1 text-sm text-gray-500">
          本平台專營寵物美容服務，以下為目前的服務分類。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900">{cat.name}</h3>
                <code className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {cat.key}
                </code>
              </div>
              {cat.isActive ? (
                <Badge variant="success">啟用</Badge>
              ) : (
                <Badge variant="default">停用</Badge>
              )}
            </div>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <p className="py-8 text-center text-sm text-gray-500">尚無分類資料。</p>
        </Card>
      )}
    </div>
  );
}
