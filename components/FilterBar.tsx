'use client';

import React, { useState } from 'react';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export interface FilterValues {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: string;
}

interface FilterBarProps {
  onFilterChange: (filters: FilterValues) => void;
  className?: string;
}

const ratingOptions = [
  { value: '', label: '不限' },
  { value: '3', label: '3+ 星' },
  { value: '4', label: '4+ 星' },
  { value: '4.5', label: '4.5+ 星' },
];

const sortOptions = [
  { value: '', label: '預設排序' },
  { value: 'rating_desc', label: '評分最高' },
  { value: 'price_asc', label: '價格低到高' },
  { value: 'price_desc', label: '價格高到低' },
];

export default function FilterBar({
  onFilterChange,
  className = '',
}: FilterBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sort, setSort] = useState('');

  function emitChange(overrides: Partial<{
    minPrice: string;
    maxPrice: string;
    minRating: string;
    sort: string;
  }> = {}) {
    const mnp = overrides.minPrice ?? minPrice;
    const mxp = overrides.maxPrice ?? maxPrice;
    const mr = overrides.minRating ?? minRating;
    const s = overrides.sort ?? sort;

    const filters: FilterValues = {};
    if (mnp) filters.minPrice = Number(mnp);
    if (mxp) filters.maxPrice = Number(mxp);
    if (mr) filters.minRating = Number(mr);
    if (s) filters.sort = s;

    onFilterChange(filters);
  }

  function handleReset() {
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSort('');
    onFilterChange({});
  }

  const filterContent = (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-3">
      {/* Price range */}
      <div className="flex items-end gap-2">
        <Input
          label="最低價"
          type="number"
          placeholder="0"
          value={minPrice}
          onChange={(e) => {
            setMinPrice(e.target.value);
            emitChange({ minPrice: e.target.value });
          }}
          className="w-28"
        />
        <span className="mb-3 text-gray-400">-</span>
        <Input
          label="最高價"
          type="number"
          placeholder="不限"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            emitChange({ maxPrice: e.target.value });
          }}
          className="w-28"
        />
      </div>

      {/* Rating */}
      <Select
        label="最低評分"
        options={ratingOptions}
        value={minRating}
        onChange={(e) => {
          setMinRating(e.target.value);
          emitChange({ minRating: e.target.value });
        }}
        className="md:w-32"
      />

      {/* Sort */}
      <Select
        label="排序"
        options={sortOptions}
        value={sort}
        onChange={(e) => {
          setSort(e.target.value);
          emitChange({ sort: e.target.value });
        }}
        className="md:w-36"
      />

      {/* Reset */}
      <Button variant="ghost" size="sm" onClick={handleReset} className="self-end">
        重置
      </Button>
    </div>
  );

  return (
    <div className={className}>
      {/* Desktop filter bar */}
      <div className="hidden md:block">{filterContent}</div>

      {/* Mobile toggle */}
      <div className="md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm4 4a1 1 0 011-1h8a1 1 0 010 2H8a1 1 0 01-1-1zm4 4a1 1 0 011-1h0a1 1 0 010 2h0a1 1 0 01-1-1z"
              />
            </svg>
            篩選條件
          </span>
          <svg
            className={`h-4 w-4 transition-transform ${mobileOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>

        {mobileOpen && <div className="mt-4">{filterContent}</div>}
      </div>
    </div>
  );
}
