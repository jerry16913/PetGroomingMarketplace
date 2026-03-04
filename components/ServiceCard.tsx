import React from 'react';
import Link from 'next/link';
import type { Service } from '@/types';
import { formatPrice, formatDuration } from '@/lib/format';
import Card from '@/components/ui/Card';

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

  return (
    <Card hover className={className}>
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
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
          <span className="text-base font-semibold text-gray-900">
            {formatPrice(service.basePrice)}
          </span>
        </div>

        {/* CTA */}
        <Link
          href={`/groomers?service=${service.id}`}
          className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
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
