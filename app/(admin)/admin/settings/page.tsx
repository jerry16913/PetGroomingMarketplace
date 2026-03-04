'use client';

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';

const leadTimeOptions = [
  { value: '1', label: '1 小時' },
  { value: '2', label: '2 小時' },
  { value: '4', label: '4 小時' },
  { value: '24', label: '24 小時' },
];

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  // Mock settings state
  const [platformName, setPlatformName] = useState('寵物美容預約平台');
  const [commissionRate, setCommissionRate] = useState('15');
  const [cancelPolicy, setCancelPolicy] = useState(
    '預約開始前 24 小時可免費取消。24 小時內取消將收取 50% 費用。未到場將收取全額費用。',
  );
  const [minLeadTime, setMinLeadTime] = useState('2');

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    showToast('設定已儲存', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">平台設定</h1>
        <p className="text-sm text-gray-500 mt-1">管理平台基本設定、費率與政策。</p>
      </div>

      <Card>
        <div className="space-y-6">
          {/* Platform Name */}
          <Input
            label="平台名稱"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
            placeholder="寵物美容預約平台"
          />

          {/* Commission Rate */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              平台服務費率
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="w-24 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4884B8] focus:border-[#4884B8]"
              />
              <span className="text-sm text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-400">
              每筆訂單完成後，平台將抽取此比例作為服務費
            </p>
          </div>

          {/* Cancel Policy */}
          <Textarea
            label="取消政策"
            value={cancelPolicy}
            onChange={(e) => setCancelPolicy(e.target.value)}
            rows={4}
            placeholder="請輸入取消政策..."
          />

          {/* Min Lead Time */}
          <Select
            label="最低預約提前時間"
            options={leadTimeOptions}
            value={minLeadTime}
            onChange={(e) => setMinLeadTime(e.target.value)}
          />

          {/* Save Button */}
          <div className="flex justify-end border-t border-gray-200 pt-4">
            <Button onClick={handleSave} loading={saving}>
              儲存設定
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
