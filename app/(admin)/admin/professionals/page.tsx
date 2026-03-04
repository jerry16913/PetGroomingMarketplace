'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Groomer } from '@/types';
import { getGroomers } from '@/lib/api';
import { formatRating, formatDate, getStatusLabel, getStatusColor } from '@/lib/format';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import Skeleton from '@/components/ui/Skeleton';

const statusTabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待審核' },
  { key: 'approved', label: '已核准' },
  { key: 'suspended', label: '已停權' },
];

export default function AdminGroomersPage() {
  const router = useRouter();
  const [groomers, setGroomers] = useState<Groomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function load() {
      try {
        const grmrs = await getGroomers();
        setGroomers(grmrs);
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
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">美容師管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理平台上所有美容師的資料與審核狀態。</p>
        </div>
        <Skeleton variant="rect" height={48} />
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

  const filtered =
    activeTab === 'all'
      ? groomers
      : groomers.filter((g) => g.status === activeTab);

  const columns = [
    {
      key: 'displayName',
      label: '姓名',
      render: (row: Record<string, unknown>) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
            {(row.displayName as string).charAt(0)}
          </div>
          <span className="font-medium text-gray-900">{row.displayName as string}</span>
        </div>
      ),
    },
    {
      key: 'ratingAvg',
      label: '評分',
      render: (row: Record<string, unknown>) => (
        <div className="flex items-center gap-1">
          <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>{formatRating(row.ratingAvg as number)}</span>
          <span className="text-gray-400">({row.ratingCount as number})</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: '狀態',
      render: (row: Record<string, unknown>) => (
        <Badge className={getStatusColor(row.status as string)}>
          {getStatusLabel(row.status as string)}
        </Badge>
      ),
    },
    {
      key: 'joinedAt',
      label: '加入日期',
      render: (row: Record<string, unknown>) => formatDate(row.joinedAt as string),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">美容師管理</h1>
        <p className="text-sm text-gray-500 mt-1">管理平台上所有美容師的資料與審核狀態。</p>
      </div>

      <Tabs tabs={statusTabs} activeTab={activeTab} onChange={setActiveTab} />

      <DataTable
        columns={columns}
        data={filtered as unknown as Record<string, unknown>[]}
        onRowClick={(row) => router.push(`/admin/professionals/${row.id}`)}
        emptyMessage="沒有符合條件的美容師"
      />
    </div>
  );
}
