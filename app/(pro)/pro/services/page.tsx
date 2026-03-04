'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { getCurrentUser } from '@/lib/auth';
import { getGroomer, getServices } from '@/lib/api';
import { formatPrice, formatDuration } from '@/lib/format';
import type { Groomer, Service, GroomerService } from '@/types';

interface ServiceRow {
  groomerService: GroomerService;
  service: Service;
  effectivePrice: number;
  effectiveDuration: number;
  hasOverride: boolean;
  active: boolean;
}

export default function ProServicesPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceRows, setServiceRows] = useState<ServiceRow[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editDuration, setEditDuration] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const user = getCurrentUser();
        if (!user?.groomerId) return;

        const [pro, allServices] = await Promise.all([
          getGroomer(user.groomerId),
          getServices(),
        ]);

        if (pro) {
          const rows: ServiceRow[] = pro.services.map((ps) => {
            const svc = allServices.find((s) => s.id === ps.serviceId);
            const effectivePrice = ps.priceOverride ?? svc?.basePrice ?? 0;
            const effectiveDuration = ps.durationOverride ?? svc?.durationMinutes ?? 0;
            return {
              groomerService: ps,
              service: svc ?? {
                id: ps.serviceId,
                categoryId: '',
                name: ps.serviceId,
                description: '',
                durationMinutes: 0,
                basePrice: 0,
              },
              effectivePrice,
              effectiveDuration,
              hasOverride: ps.priceOverride !== undefined || ps.durationOverride !== undefined,
              active: true,
            };
          });
          setServiceRows(rows);
        }
      } catch {
        setError('載入服務資料失敗，請稍後重試。');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openEditModal = (idx: number) => {
    const row = serviceRows[idx];
    setEditingIdx(idx);
    setEditPrice(String(row.effectivePrice));
    setEditDuration(String(row.effectiveDuration));
    setModalOpen(true);
  };

  const handleSaveOverride = () => {
    if (editingIdx === null) return;

    const newRows = [...serviceRows];
    const price = parseInt(editPrice, 10);
    const duration = parseInt(editDuration, 10);

    if (isNaN(price) || price < 0 || isNaN(duration) || duration <= 0) {
      showToast('請輸入有效的價格與時間', 'error');
      return;
    }

    newRows[editingIdx] = {
      ...newRows[editingIdx],
      effectivePrice: price,
      effectiveDuration: duration,
      hasOverride: true,
    };
    setServiceRows(newRows);
    setModalOpen(false);
    setEditingIdx(null);
    showToast('服務價格已更新', 'success');
  };

  const toggleActive = (idx: number) => {
    const newRows = [...serviceRows];
    newRows[idx] = { ...newRows[idx], active: !newRows[idx].active };
    setServiceRows(newRows);
    showToast(
      newRows[idx].active ? '服務已啟用' : '服務已停用',
      'info'
    );
  };

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" width={200} height={32} />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rect" height={80} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">服務管理</h1>
        <p className="mt-1 text-sm text-gray-500">
          管理您提供的服務項目、定價與時長。
        </p>
      </div>

      {serviceRows.length === 0 ? (
        <Card>
          <EmptyState
            title="尚無任何服務項目"
            description="您目前沒有設定任何服務，請聯繫管理員新增服務。"
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {serviceRows.map((row, idx) => (
            <Card key={row.service.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-medium text-gray-900">
                      {row.service.name}
                    </h3>
                    {row.hasOverride && (
                      <Badge variant="warning" size="sm">
                        自訂價格
                      </Badge>
                    )}
                    {!row.active && (
                      <Badge variant="default" size="sm">
                        已停用
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {row.service.description}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                    <span>
                      價格：
                      <span className="font-medium text-gray-900">
                        {formatPrice(row.effectivePrice)}
                      </span>
                      {row.groomerService.priceOverride !== undefined && (
                        <span className="ml-1 text-xs text-gray-400 line-through">
                          {formatPrice(row.service.basePrice)}
                        </span>
                      )}
                    </span>
                    <span>
                      時長：
                      <span className="font-medium text-gray-900">
                        {formatDuration(row.effectiveDuration)}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(idx)}
                  >
                    修改價格
                  </Button>
                  <button
                    onClick={() => toggleActive(idx)}
                    className={`
                      relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200
                      ${row.active ? 'bg-[#4884B8]' : 'bg-gray-200'}
                    `}
                    role="switch"
                    aria-checked={row.active}
                  >
                    <span
                      className={`
                        inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200
                        ${row.active ? 'translate-x-5' : 'translate-x-0'}
                      `}
                    />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingIdx(null);
        }}
        title="修改服務價格與時長"
      >
        {editingIdx !== null && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              服務：{serviceRows[editingIdx].service.name}
            </p>
            <Input
              label="自訂價格 (NT$)"
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
            />
            <Input
              label="自訂時長 (分鐘)"
              type="number"
              value={editDuration}
              onChange={(e) => setEditDuration(e.target.value)}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setModalOpen(false);
                  setEditingIdx(null);
                }}
              >
                取消
              </Button>
              <Button onClick={handleSaveOverride}>儲存</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
