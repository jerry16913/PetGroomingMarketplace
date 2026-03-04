'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import dayjs from 'dayjs';

const SLOT_START = 9; // 09:00
const SLOT_END = 18; // 18:00
const SLOT_INTERVAL = 30; // 30 min

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = SLOT_START; h < SLOT_END; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

const DAY_LABELS = ['一', '二', '三', '四', '五', '六', '日'];

function getWeekDates(weekOffset: number): dayjs.Dayjs[] {
  // Start from Monday of the given week
  const startOfWeek = dayjs()
    .startOf('week')
    .add(1, 'day') // Monday (dayjs startOf week is Sunday)
    .add(weekOffset * 7, 'day');

  return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));
}

export default function ProAvailabilityPage() {
  const { showToast } = useToast();
  const [weekOffset, setWeekOffset] = useState(0);
  const [saving, setSaving] = useState(false);

  // Availability state: Map<"YYYY-MM-DD|HH:mm", boolean>
  const [availability, setAvailability] = useState<Record<string, boolean>>(() => {
    // Initialize with default availability (Mon-Fri 09:00-18:00)
    const init: Record<string, boolean> = {};
    for (let w = -2; w <= 4; w++) {
      const dates = getWeekDates(w);
      dates.forEach((date, dayIdx) => {
        TIME_SLOTS.forEach((slot) => {
          const key = `${date.format('YYYY-MM-DD')}|${slot}`;
          // Default: weekdays are available
          init[key] = dayIdx < 5;
        });
      });
    }
    return init;
  });

  const weekDates = getWeekDates(weekOffset);

  const toggleSlot = (dateStr: string, slot: string) => {
    const key = `${dateStr}|${slot}`;
    setAvailability((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isAvailable = (dateStr: string, slot: string) => {
    const key = `${dateStr}|${slot}`;
    return availability[key] ?? false;
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    showToast('預約時段已儲存', 'success');
  };

  const weekRangeLabel = `${weekDates[0].format('YYYY/MM/DD')} - ${weekDates[6].format('YYYY/MM/DD')}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">預約時段</h1>
        <p className="mt-1 text-sm text-gray-500">
          點擊時段切換可用/不可用，藍色代表可預約。
        </p>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setWeekOffset((prev) => prev - 1)}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          上一週
        </Button>
        <span className="text-sm font-medium text-gray-700">{weekRangeLabel}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setWeekOffset((prev) => prev + 1)}
        >
          下一週
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>

      {/* Week grid */}
      <Card className="overflow-x-auto !p-0">
        <div className="min-w-[640px]">
          {/* Header row: day labels */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-200">
            <div className="border-r border-gray-200 bg-gray-50 px-2 py-3" />
            {weekDates.map((date, i) => {
              const isToday = date.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');
              return (
                <div
                  key={i}
                  className={`border-r border-gray-200 px-2 py-3 text-center last:border-r-0 ${
                    isToday ? 'bg-[#DBEAF5]' : 'bg-gray-50'
                  }`}
                >
                  <div className="text-xs text-gray-500">週{DAY_LABELS[i]}</div>
                  <div
                    className={`mt-0.5 text-sm font-medium ${
                      isToday ? 'text-[#4884B8]' : 'text-gray-900'
                    }`}
                  >
                    {date.format('MM/DD')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time slot rows */}
          {TIME_SLOTS.map((slot) => (
            <div
              key={slot}
              className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center justify-center border-r border-gray-200 px-2 py-1 text-xs text-gray-500">
                {slot}
              </div>
              {weekDates.map((date, i) => {
                const dateStr = date.format('YYYY-MM-DD');
                const available = isAvailable(dateStr, slot);
                return (
                  <button
                    key={i}
                    onClick={() => toggleSlot(dateStr, slot)}
                    className={`
                      border-r border-gray-100 px-1 py-1 text-xs transition-colors last:border-r-0
                      ${
                        available
                          ? 'bg-[#DBEAF5] text-[#4884B8] hover:bg-[#CBE0F2]'
                          : 'bg-white text-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    {available ? '可預約' : '-'}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving}>
          儲存
        </Button>
      </div>
    </div>
  );
}
