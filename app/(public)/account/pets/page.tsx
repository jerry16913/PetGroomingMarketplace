'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { getPets, createPet, updatePet, deletePet } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import type { Pet } from '@/types';

interface PetFormData {
  name: string;
  breed: string;
  weight: string;
  birthday: string;
}

const emptyForm: PetFormData = {
  name: '',
  breed: '',
  weight: '',
  birthday: '',
};

export default function PetsPage() {
  const { showToast } = useToast();

  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [form, setForm] = useState<PetFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const user = getCurrentUser();

  useEffect(() => {
    loadPets();
  }, []);

  async function loadPets() {
    if (!user) {
      setError('請先登入');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const list = await getPets(user.id);
      setPets(list);
    } catch {
      setError('載入寵物資料失敗，請稍後重試。');
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingPet(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(pet: Pet) {
    setEditingPet(pet);
    setForm({
      name: pet.name,
      breed: pet.breed,
      weight: String(pet.weight),
      birthday: pet.birthday,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingPet(null);
    setForm(emptyForm);
  }

  async function handleSubmit() {
    if (!user) return;

    if (!form.name.trim()) {
      showToast('請輸入寵物名字', 'error');
      return;
    }
    if (!form.breed.trim()) {
      showToast('請輸入品種', 'error');
      return;
    }
    if (!form.weight || Number(form.weight) <= 0) {
      showToast('請輸入有效的體重', 'error');
      return;
    }
    if (!form.birthday) {
      showToast('請選擇生日', 'error');
      return;
    }

    try {
      setSubmitting(true);

      if (editingPet) {
        // Update existing pet
        const updated = await updatePet(editingPet.id, {
          name: form.name.trim(),
          breed: form.breed.trim(),
          weight: Number(form.weight),
          birthday: form.birthday,
        });
        setPets((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p)),
        );
        showToast('寵物資料已更新', 'success');
      } else {
        // Create new pet
        const created = await createPet({
          ownerId: user.id,
          name: form.name.trim(),
          breed: form.breed.trim(),
          weight: Number(form.weight),
          birthday: form.birthday,
        });
        setPets((prev) => [...prev, created]);
        showToast('寵物已新增', 'success');
      }

      closeModal();
    } catch {
      showToast(editingPet ? '更新失敗，請重試' : '新增失敗，請重試', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletePet(id);
      setPets((prev) => prev.filter((p) => p.id !== id));
      setDeletingId(null);
      showToast('寵物已刪除', 'success');
    } catch {
      showToast('刪除失敗，請重試', 'error');
    }
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-red-50 p-6 text-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">我的寵物</h1>
          <p className="mt-1 text-sm text-gray-500">管理您的寵物資料</p>
        </div>
        <Button onClick={openAddModal}>新增寵物</Button>
      </div>

      {/* Pet List */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rect" height={160} />
          ))}
        </div>
      ) : pets.length === 0 ? (
        <EmptyState
          title="尚未新增寵物"
          description="點擊「新增寵物」按鈕來新增您的第一隻寵物"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {pets.map((pet) => (
            <Card key={pet.id}>
              <div className="flex flex-col gap-4">
                {/* Pet Header */}
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-3xl shrink-0">
                    🐾
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {pet.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-gray-500">{pet.breed}</p>
                  </div>
                </div>

                {/* Pet Details */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400">體重</span>
                    <p className="mt-0.5 font-medium text-gray-900">
                      {pet.weight} kg
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">生日</span>
                    <p className="mt-0.5 font-medium text-gray-900">
                      {pet.birthday}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(pet)}
                  >
                    編輯
                  </Button>
                  {deletingId === pet.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-red-600">確定刪除？</span>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(pet.id)}
                      >
                        確定
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingId(null)}
                      >
                        取消
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingId(pet.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      刪除
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingPet ? '編輯寵物' : '新增寵物'}
      >
        <div className="space-y-4">
          <Input
            label="名字"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="請輸入寵物名字"
          />
          <Input
            label="品種"
            required
            value={form.breed}
            onChange={(e) => setForm({ ...form, breed: e.target.value })}
            placeholder="例：貴賓、柴犬、英短"
          />
          <Input
            label="體重 (kg)"
            required
            type="number"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            placeholder="例：5"
          />
          <Input
            label="生日"
            required
            type="date"
            value={form.birthday}
            onChange={(e) => setForm({ ...form, birthday: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={closeModal}>
              取消
            </Button>
            <Button onClick={handleSubmit} loading={submitting}>
              {editingPet ? '儲存' : '新增'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
