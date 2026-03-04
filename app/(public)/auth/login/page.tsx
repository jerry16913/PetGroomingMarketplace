'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { login } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('請填寫電子郵件和密碼。');
      return;
    }

    setLoading(true);
    try {
      const user = login(email.trim(), password);
      if (!user) {
        setError('電子郵件或密碼不正確。');
        return;
      }

      // Redirect based on role
      switch (user.role) {
        case 'groomer':
          router.push('/pro/dashboard');
          break;
        case 'admin':
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/');
          break;
      }
    } catch {
      setError('登入失敗，請稍後重試。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px-160px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">登入</h1>
          <p className="mt-2 text-sm text-gray-500">
            歡迎回到寵物美容預約平台
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="請輸入密碼"
            />

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              登入
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            還沒有帳號？{' '}
            <Link
              href="/auth/register"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              立即註冊
            </Link>
          </div>
        </Card>

        {/* Test Accounts */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            測試帳號
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            所有帳號密碼皆為：<code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-gray-700">password</code>
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-700">顧客</span>
                <span className="ml-2 text-gray-500">customer@test.com</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail('customer@test.com');
                  setPassword('password');
                }}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                填入
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-700">美容師</span>
                <span className="ml-2 text-gray-500">pro@test.com</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail('pro@test.com');
                  setPassword('password');
                }}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                填入
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-700">管理員</span>
                <span className="ml-2 text-gray-500">admin@test.com</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@test.com');
                  setPassword('password');
                }}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                填入
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
