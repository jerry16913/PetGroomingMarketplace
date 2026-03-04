'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

export default function ProSettingsPage() {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  // Notification toggles
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [bookingNotif, setBookingNotif] = useState(true);
  const [reviewNotif, setReviewNotif] = useState(true);

  // Mock bank info
  const [bankName] = useState('台灣銀行');
  const [bankAccount] = useState('**** **** **** 5678');

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    showToast('設定已儲存', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <p className="mt-1 text-sm text-gray-500">
          管理您的通知偏好與收款方式。
        </p>
      </div>

      {/* Notification preferences */}
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">通知設定</h2>
        <div className="space-y-4">
          {/* Email notification */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Email 通知</p>
              <p className="text-sm text-gray-500">接收預約和系統通知的電子郵件</p>
            </div>
            <button
              onClick={() => setEmailNotif(!emailNotif)}
              className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200
                ${emailNotif ? 'bg-blue-600' : 'bg-gray-200'}
              `}
              role="switch"
              aria-checked={emailNotif}
            >
              <span
                className={`
                  inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200
                  ${emailNotif ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          {/* SMS notification */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">簡訊通知</p>
              <p className="text-sm text-gray-500">接收預約提醒的手機簡訊</p>
            </div>
            <button
              onClick={() => setSmsNotif(!smsNotif)}
              className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200
                ${smsNotif ? 'bg-blue-600' : 'bg-gray-200'}
              `}
              role="switch"
              aria-checked={smsNotif}
            >
              <span
                className={`
                  inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200
                  ${smsNotif ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          {/* Booking notification */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">新預約通知</p>
              <p className="text-sm text-gray-500">有客戶新建預約時立即通知</p>
            </div>
            <button
              onClick={() => setBookingNotif(!bookingNotif)}
              className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200
                ${bookingNotif ? 'bg-blue-600' : 'bg-gray-200'}
              `}
              role="switch"
              aria-checked={bookingNotif}
            >
              <span
                className={`
                  inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200
                  ${bookingNotif ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          {/* Review notification */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">評價通知</p>
              <p className="text-sm text-gray-500">客戶留下評價時通知您</p>
            </div>
            <button
              onClick={() => setReviewNotif(!reviewNotif)}
              className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200
                ${reviewNotif ? 'bg-blue-600' : 'bg-gray-200'}
              `}
              role="switch"
              aria-checked={reviewNotif}
            >
              <span
                className={`
                  inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200
                  ${reviewNotif ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Payment method */}
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">收款方式</h2>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center gap-4">
            {/* Bank icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white border border-gray-200">
              <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{bankName}</p>
              <p className="text-sm text-gray-500">{bankAccount}</p>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          如需更換收款帳戶，請聯繫平台客服。
        </p>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving}>
          儲存設定
        </Button>
      </div>
    </div>
  );
}
