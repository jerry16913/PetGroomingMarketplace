'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';

const roleOptions = [
  { value: 'customer', label: '顧客' },
  { value: 'groomer', label: '美容師' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('請填寫所有必填欄位。');
      return;
    }

    if (password.length < 6) {
      setError('密碼至少需要 6 個字元。');
      return;
    }

    setLoading(true);
    try {
      // Mock: just show success and redirect
      await new Promise((resolve) => setTimeout(resolve, 500));
      showToast('註冊成功！請登入您的帳號。', 'success');
      router.push('/auth/login');
    } catch {
      setError('註冊失敗，請稍後重試。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px-160px)] items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">建立帳號</h1>
          <p className="mt-2 text-sm text-gray-500">
            加入 Paw Paw 泡泡，開始預約服務
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="姓名"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="請輸入您的姓名"
            />

            <Input
              label="電子郵件"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <Input
              label="密碼"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 6 個字元"
            />

            <Select
              label="帳號類型"
              required
              options={roleOptions}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              註冊
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            已經有帳號？{' '}
            <Link
              href="/auth/login"
              className="font-medium text-[#4884B8] hover:text-[#3E78AC]"
            >
              登入
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
