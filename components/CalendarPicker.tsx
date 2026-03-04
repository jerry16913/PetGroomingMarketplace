'use client';

import React, { useState } from 'react';
import dayjs from 'dayjs';

interface CalendarPickerProps {
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  minDate?: string;
  className?: string;
}

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

export default function CalendarPicker({
  selectedDate,
  onDateSelect,
  minDate,
  className = '',
}: CalendarPickerProps) {
  const today = dayjs().startOf('day');
  const effectiveMinDate = minDate ? dayjs(minDate).startOf('day') : today;

  const [viewMonth, setViewMonth] = useState(() => {
    if (selectedDate) return dayjs(selectedDate).startOf('month');
    return today.startOf('month');
  });

  const startOfMonth = viewMonth.startOf('month');
  const endOfMonth = viewMonth.endOf('month');
  const startDayOfWeek = startOfMonth.day(); // 0=Sunday

  // Build calendar grid days
  const calendarDays: (dayjs.Dayjs | null)[] = [];

  // Leading empty cells
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Days in the month
  const daysInMonth = endOfMonth.date();
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(viewMonth.date(d));
  }

  function handlePrevMonth() {
    setViewMonth((prev) => prev.subtract(1, 'month'));
  }

  function handleNextMonth() {
    setViewMonth((prev) => prev.add(1, 'month'));
  }

  function isDisabled(date: dayjs.Dayjs): boolean {
    return date.isBefore(effectiveMinDate, 'day');
  }

  function isSelected(date: dayjs.Dayjs): boolean {
    if (!selectedDate) return false;
    return date.format('YYYY-MM-DD') === dayjs(selectedDate).format('YYYY-MM-DD');
  }

  function isToday(date: dayjs.Dayjs): boolean {
    return date.format('YYYY-MM-DD') === today.format('YYYY-MM-DD');
  }

  // Prevent navigating before the minDate month
  const canGoPrev = viewMonth.isAfter(effectiveMinDate.startOf('month'), 'month') ||
    viewMonth.isSame(effectiveMinDate.startOf('month'), 'month')
    ? viewMonth.isAfter(effectiveMinDate.startOf('month'), 'month')
    : false;

  return (
    <div className={`w-full max-w-sm ${className}`}>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          disabled={!canGoPrev}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="上個月"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-sm font-semibold text-gray-900">
          {viewMonth.format('YYYY 年 M 月')}
        </h3>
        <button
          onClick={handleNextMonth}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="下個月"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="py-2 text-center text-xs font-medium text-gray-500"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-10" />;
          }

          const disabled = isDisabled(date);
          const selected = isSelected(date);
          const todayMark = isToday(date);

          return (
            <button
              key={date.format('YYYY-MM-DD')}
              onClick={() => !disabled && onDateSelect(date.format('YYYY-MM-DD'))}
              disabled={disabled}
              className={`
                h-10 rounded-lg text-sm font-medium transition-colors
                ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}
                ${selected ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                ${!selected && todayMark ? 'ring-2 ring-blue-200 text-blue-600' : ''}
                ${!selected && !disabled && !todayMark ? 'text-gray-700' : ''}
              `}
            >
              {date.date()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
