'use client';

import React, { useEffect, useState, useCallback } from 'react';
import type { Resource, ResourceType } from '@/types';
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
  toggleResourceActive,
} from '@/lib/api';
import DataTable from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import Textarea from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';
import ResourceBadge from '@/components/ResourceBadge';

const resourceTypeOptions = [
  { value: 'groom_table', label: '美容台' },
  { value: 'bath', label: '洗澡台' },
  { value: 'dryer', label: '烘毛區' },
];

const typeLabels: Record<string, string> = {
  groom_table: '美容台',
  bath: '洗澡台',
  dryer: '烘毛區',
};

const filterOptions = [
  { value: 'all', label: '全部' },
  ...resourceTypeOptions,
];

export default function AdminResourcesPage() {
  const { showToast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<ResourceType>('groom_table');
  const [formTags, setFormTags] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [saving, setSaving] = useState(false);

  // Delete confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingResource, setDeletingResource] = useState<Resource | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadResources = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getResources();
      setResources(res);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入資料失敗');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  // Filtered data
  const filteredResources = typeFilter === 'all'
    ? resources
    : resources.filter((r) => r.type === typeFilter);

  const openCreateModal = () => {
    setEditingResource(null);
    setFormName('');
    setFormType('groom_table');
    setFormTags('');
    setFormNotes('');
    setFormActive(true);
    setModalOpen(true);
  };

  const openEditModal = (res: Resource) => {
    setEditingResource(res);
    setFormName(res.name);
    setFormType(res.type);
    setFormTags(res.tags?.join(', ') ?? '');
    setFormNotes(res.notes ?? '');
    setFormActive(res.isActive);
    setModalOpen(true);
  };

  const parseTags = (input: string): string[] => {
    return input
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      showToast('請填寫資源名稱', 'error');
      return;
    }

    setSaving(true);
    try {
      const tags = parseTags(formTags);

      if (editingResource) {
        const updated = await updateResource(editingResource.id, {
          name: formName.trim(),
          type: formType,
          tags,
          notes: formNotes.trim() || undefined,
          isActive: formActive,
        });
        setResources((prev) =>
          prev.map((r) => (r.id === editingResource.id ? updated : r)),
        );
        showToast('資源已更新', 'success');
      } else {
        const newRes = await createResource({
          locationId: 'loc1',
          name: formName.trim(),
          type: formType,
          tags,
          notes: formNotes.trim() || undefined,
          isActive: formActive,
        });
        setResources((prev) => [...prev, newRes]);
        showToast('資源已新增', 'success');
      }
      setModalOpen(false);
    } catch {
      showToast('操作失敗', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (res: Resource) => {
    try {
      const updated = await toggleResourceActive(res.id);
      setResources((prev) =>
        prev.map((r) => (r.id === res.id ? updated : r)),
      );
      showToast(updated.isActive ? '已啟用' : '已停用', 'success');
    } catch {
      showToast('更新失敗', 'error');
    }
  };

  const openDeleteModal = (res: Resource) => {
    setDeletingResource(res);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingResource) return;
    setDeleting(true);
    try {
      await deleteResource(deletingResource.id);
      setResources((prev) => prev.filter((r) => r.id !== deletingResource.id));
      showToast('資源已刪除', 'success');
      setDeleteModalOpen(false);
      setDeletingResource(null);
    } catch {
      showToast('刪除失敗', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // -- Columns --
  const columns = [
    {
      key: 'name',
      label: '資源名稱',
      render: (row: Record<string, unknown>) => {
        const r = row as unknown as Resource;
        return <ResourceBadge type={r.type} name={r.name} />;
      },
    },
    {
      key: 'type',
      label: '類型',
      render: (row: Record<string, unknown>) => {
        const r = row as unknown as Resource;
        return (
          <span className="text-sm text-gray-600">
            {typeLabels[r.type] ?? r.type}
          </span>
        );
      },
    },
    {
      key: 'tags',
      label: '標籤',
      render: (row: Record<string, unknown>) => {
        const r = row as unknown as Resource;
        if (!r.tags || r.tags.length === 0) {
          return <span className="text-sm text-gray-400">-</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {r.tags.map((tag) => (
              <Badge key={tag} variant="info" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      key: 'isActive',
      label: '狀態',
      render: (row: Record<string, unknown>) => {
        const r = row as unknown as Resource;
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleActive(r);
            }}
            className="focus:outline-none"
          >
            {r.isActive ? (
              <Badge variant="success">啟用</Badge>
            ) : (
              <Badge variant="default">停用</Badge>
            )}
          </button>
        );
      },
    },
    {
      key: 'actions',
      label: '操作',
      render: (row: Record<string, unknown>) => {
        const r = row as unknown as Resource;
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openEditModal(r);
              }}
            >
              編輯
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openDeleteModal(r);
              }}
            >
              刪除
            </Button>
          </div>
        );
      },
    },
  ];

  // -- Loading state --
  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">資源管理</h1>
        <Skeleton variant="rect" height={400} />
      </div>
    );
  }

  // -- Error state --
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">資源管理</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600">{error}</p>
          <Button variant="outline" className="mt-4" onClick={loadResources}>
            重試
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">資源管理</h1>
        <Button onClick={openCreateModal}>新增資源</Button>
      </div>

      {/* Type filter */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">類型篩選</label>
        <Select
          options={filterOptions}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredResources as unknown as Record<string, unknown>[]}
        emptyMessage="尚無資源"
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingResource ? '編輯資源' : '新增資源'}
      >
        <div className="space-y-4">
          <Input
            label="資源名稱"
            placeholder="例如：1號美容台"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />
          <Select
            label="資源類型"
            options={resourceTypeOptions}
            value={formType}
            onChange={(e) => setFormType(e.target.value as ResourceType)}
            required
          />
          <Input
            label="標籤"
            placeholder="以逗號分隔，例如：大型犬, VIP"
            value={formTags}
            onChange={(e) => setFormTags(e.target.value)}
          />
          <Textarea
            label="備註"
            placeholder="可選填備註..."
            value={formNotes}
            onChange={(e) => setFormNotes(e.target.value)}
            rows={3}
          />
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">啟用狀態</label>
            <button
              type="button"
              onClick={() => setFormActive(!formActive)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${formActive ? 'bg-indigo-600' : 'bg-gray-200'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${formActive ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
            <span className="text-sm text-gray-500">{formActive ? '啟用' : '停用'}</span>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave} loading={saving}>
              {editingResource ? '儲存' : '新增'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="確認刪除"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            確定要刪除資源「<span className="font-medium text-gray-900">{deletingResource?.name}</span>」嗎？此操作無法復原。
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              取消
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              確認刪除
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
