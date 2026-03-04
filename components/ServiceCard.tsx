import React from 'react';
import Link from 'next/link';
import type { Service } from '@/types';
import { formatPrice, formatDuration } from '@/lib/format';
import Card from '@/components/ui/Card';

const serviceIcons: Record<string, string> = {
  '狗狗洗澡': '🛁',
  '狗狗美容': '✂️',
  '貓咪美容': '🐱',
  '貓咪洗澡': '🛁',
  '小型犬美容': '🐩',
  '中型犬美容': '🐕',
  '大型犬美容': '🦮',
  '特殊造型': '💇',
  '寵物 SPA': '💆',
  '比賽造型': '🏆',
};

interface ServiceCardProps {
  service: Service;
  className?: string;
}

export default function ServiceCard({
  service,
  className = '',
}: ServiceCardProps) {
  const truncatedDescription =
    service.description.length > 80
      ? service.description.slice(0, 80) + '...'
      : service.description;

  const icon = serviceIcons[service.name] ?? '🐾';

  return (
    <Card hover className={className}>
      <div className="flex flex-col gap-3">
        {/* Header: icon + title */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-xl">
            {icon}
          </div>
          <h3 className="text-base font-semibold text-gray-900">{service.name}</h3>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed">{truncatedDescription}</p>

        {/* Duration and price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{formatDuration(service.durationMinutes)}</span>
          </div>
          <span className="text-gray-900 font-semibold">
            {formatPrice(service.basePrice)}
          </span>
        </div>

        {/* CTA */}
        <Link
          href={`/groomers?service=${service.id}`}
          className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          瀏覽美容師
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </Card>
  );
}
