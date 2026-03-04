'use client';

import React from 'react';

interface TimeSlotPickerProps {
  slots: string[];
  selectedSlot: string | null;
  onSlotSelect: (slot: string) => void;
  className?: string;
}

export default function TimeSlotPicker({
  slots,
  selectedSlot,
  onSlotSelect,
  className = '',
}: TimeSlotPickerProps) {
  if (slots.length === 0) {
    return (
      <div className={`text-center py-8 text-sm text-gray-500 ${className}`}>
        該日期沒有可用時段
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 ${className}`}>
      {slots.map((slot) => {
        const isSelected = slot === selectedSlot;
        return (
          <button
            key={slot}
            onClick={() => onSlotSelect(slot)}
            className={`
              rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors
              ${
                isSelected
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }
            `}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
}
