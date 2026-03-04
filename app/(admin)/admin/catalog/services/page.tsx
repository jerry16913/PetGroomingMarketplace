'use client';

import React, { useEffect, useState } from 'react';
import type { Service } from '@/types';
import { getServices } from '@/lib/api';
import { formatPrice, formatDuration } from '@/lib/format';
import DataTable from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Modal from '@/components/ui/Modal';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';

export default function AdminServicesPage() {
  const { showToast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDuration, setFormDuration] = useState('');
  const [formPrice, setFormPrice] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const svcs = await getServices();
        setServices(svcs);
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入資料失敗');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setFormName('');
    setFormDescription('');
    setFormDuration('60');
    setFormPrice('1000');
    setModalOpen(true);
  };

  const openEditModal = (svc: Service) => {
    setEditingService(svc);
    setFormName(svc.name);
    setFormDescription(svc.description);
    setFormDuration(String(svc.durationMinutes));
    setFormPrice(String(svc.basePrice));
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formDuration || !formPrice) {
      showToast('請填寫所有必填欄位', 'error');
      return;
    }

    const duration = parseInt(formDuration, 10);
    const price = parseInt(formPrice, 10);

    if (isNaN(duration) || duration <= 0) {
      showToast('請輸入有效的服務時長', 'error');
      return;
    }
    if (isNaN(price) || price < 0) {
      showToast('請輸入有效的價格', 'error');
      return;
    }

    if (editingService) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? {
                ...s,
                name: formName.trim(),
                description: formDescription.trim(),
                categoryId: 'pet_grooming',
                durationMinutes: duration,
                basePrice: price,
              }
            : s,
        ),
      );
      showToast('服務已更新', 'success');
    } else {
      const newSvc: Service = {
        id: `svc-${Date.now()}`,
        name: formName.trim(),
        description: formDescription.trim(),
        categoryId: 'pet_grooming',
        durationMinutes: duration,
        basePrice: price,
      };
      setServices((prev) => [...prev, newSvc]);
      showToast('服務已新增', 'success');
    }

    setModalOpen(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">服務管理</h1>
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

  const columns = [
    {
      key: 'name',
      label: '服務名稱',
      render: (row: Record<string, unknown>) => (
        <span className="font-medium text-gray-900">{row.name as string}</span>
      ),
    },
    {
      key: 'durationMinutes',
      label: '時長',
      render: (row: Record<string, unknown>) =>
        formatDuration(row.durationMinutes as number),
    },
    {
      key: 'basePrice',
      label: '基本價格',
      render: (row: Record<string, unknown>) => formatPrice(row.basePrice as number),
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
            openEditModal(row as unknown as Service);
          }}
        >
          編輯
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">服務管理</h1>
        <Button onClick={openCreateModal}>新增服務</Button>
      </div>

      <DataTable
        columns={columns}
        data={services as unknown as Record<string, unknown>[]}
        emptyMessage="尚無服務項目"
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingService ? '編輯服務' : '新增服務'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="服務名稱"
            placeholder="例如：基礎洗澡"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />
          <Textarea
            label="服務描述"
            placeholder="請輸入服務描述..."
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="服務時長 (分鐘)"
              type="number"
              placeholder="60"
              value={formDuration}
              onChange={(e) => setFormDuration(e.target.value)}
              required
            />
            <Input
              label="基本價格 (NT$)"
              type="number"
              placeholder="1000"
              value={formPrice}
              onChange={(e) => setFormPrice(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>
              {editingService ? '儲存' : '新增'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
