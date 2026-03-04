'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { getCurrentUser } from '@/lib/auth';
import { getGroomer } from '@/lib/api';
import type { Groomer } from '@/types';

export default function ProProfilePage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groomer, setGroomer] = useState<Groomer | null>(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Mock file upload
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const user = getCurrentUser();
        if (!user?.groomerId) return;

        const pro = await getGroomer(user.groomerId);

        if (pro) {
          setGroomer(pro);
          setDisplayName(pro.displayName);
          setBio(pro.bio);
          setPhone(pro.phone);
          setEmail(pro.email);
        }
      } catch {
        setError('載入個人資料失敗，請稍後重試。');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // Mock save delay
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    showToast('個人資料已儲存', 'success');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      showToast('已選取作品檔案（模擬上傳）', 'info');
    }
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
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rect" height={60} />
          ))}
        </div>
      </div>
    );
  }

  if (!groomer) {
    return (
      <div className="rounded-lg bg-yellow-50 p-6 text-center text-sm text-yellow-700">
        找不到您的美容師資料。
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">個人資料</h1>
        <p className="mt-1 text-sm text-gray-500">
          管理您的公開檔案與聯絡資訊。
        </p>
      </div>

      {/* Basic info form */}
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">基本資訊</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="顯示名稱"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <Input
            label="電話"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="電子信箱"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="sm:col-span-2"
          />
          <Textarea
            label="自我介紹"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="sm:col-span-2"
          />
        </div>
      </Card>

      {/* Portfolio */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">作品集</h2>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              上傳作品
            </span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {groomer.portfolio.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
            >
              {/* Image placeholder */}
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              {/* Caption overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-2">
                <p className="truncate text-xs text-white">{item.caption}</p>
              </div>
            </div>
          ))}

          {/* Preview for newly selected file */}
          {previewUrl && (
            <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-dashed border-blue-300 bg-blue-50">
              <img
                src={previewUrl}
                alt="新上傳預覽"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-2">
                <p className="truncate text-xs text-white">新作品（預覽）</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving}>
          儲存資料
        </Button>
      </div>
    </div>
  );
}
