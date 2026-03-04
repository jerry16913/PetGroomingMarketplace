import React from 'react';
import Link from 'next/link';
import type { Groomer, Service } from '@/types';
import { formatPrice, formatRating } from '@/lib/format';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface GroomerCardProps {
  groomer: Groomer;
  services: Service[];
  className?: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = rating >= star ? 'text-yellow-400' : rating >= star - 0.5 ? 'text-yellow-400' : 'text-gray-200';
        return (
          <svg
            key={star}
            className={`h-4 w-4 ${fill}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
    </div>
  );
}

export default function GroomerCard({
  groomer,
  services,
  className = '',
}: GroomerCardProps) {
  // Match groomer's services with the full Service objects
  const matchedServices = groomer.services
    .slice(0, 2)
    .map((gs) => {
      const service = services.find((s) => s.id === gs.serviceId);
      if (!service) return null;
      return {
        name: service.name,
        price: gs.priceOverride ?? service.basePrice,
      };
    })
    .filter(Boolean) as { name: string; price: number }[];

  return (
    <Card hover className={className}>
      <div className="flex flex-col gap-4">
        {/* Header: avatar, name, rating */}
        <div className="flex items-start gap-4">
          <img
            src={groomer.avatarUrl}
            alt={groomer.displayName}
            className="h-14 w-14 rounded-full object-cover bg-gray-100"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {groomer.displayName}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <StarRating rating={groomer.ratingAvg} />
              <span className="text-sm text-gray-500">
                {formatRating(groomer.ratingAvg)} ({groomer.ratingCount})
              </span>
            </div>
          </div>
        </div>

        {/* Top services */}
        {matchedServices.length > 0 && (
          <div className="space-y-2">
            {matchedServices.map((svc) => (
              <div key={svc.name} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 truncate">{svc.name}</span>
                <span className="ml-2 font-medium text-gray-900 whitespace-nowrap">
                  {formatPrice(svc.price)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <Link href={`/groomers/${groomer.id}`}>
          <Button variant="outline" size="sm" className="w-full">
            查看詳情
          </Button>
        </Link>
      </div>
    </Card>
  );
}
