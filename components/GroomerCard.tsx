import React, { useState } from 'react';
import Link from 'next/link';
import type { Groomer, Service } from '@/types';
import { formatPrice, formatRating } from '@/lib/format';

const avatarGradients = [
  'from-[#4884B8] to-[#72A8D2]',
  'from-[#4884B8] to-[#92BFE0]',
  'from-[#5999C8] to-[#4884B8]',
  'from-[#4884B8] to-[#82B4D9]',
  'from-[#3E78AC] to-[#4884B8]',
];

interface GroomerCardProps {
  groomer: Groomer;
  services: Service[];
  className?: string;
}

export default function GroomerCard({
  groomer,
  services,
  className = '',
}: GroomerCardProps) {
  const [imgError, setImgError] = useState(false);
  const gradientIndex = groomer.id.charCodeAt(groomer.id.length - 1) % avatarGradients.length;
  const gradient = avatarGradients[gradientIndex];
  // Match groomer's services with the full Service objects
  const matchedServices = groomer.services
    .map((gs) => {
      const service = services.find((s) => s.id === gs.serviceId);
      if (!service) return null;
      return {
        name: service.name,
        price: gs.priceOverride ?? service.basePrice,
      };
    })
    .filter(Boolean) as { name: string; price: number }[];

  const lowestPrice =
    matchedServices.length > 0
      ? Math.min(...matchedServices.map((s) => s.price))
      : null;

  return (
    <Link href={`/groomers/${groomer.id}`} className={`block ${className}`}>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 overflow-hidden">
        {/* Avatar — edge to edge */}
        <div className="aspect-square overflow-hidden">
          {imgError ? (
            <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
              <span className="text-5xl font-bold text-white/90">
                {groomer.displayName.charAt(0)}
              </span>
            </div>
          ) : (
            <img
              src={groomer.avatarUrl}
              alt={groomer.displayName}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          )}
        </div>

        {/* Details */}
        <div className="p-5">
          {/* Name */}
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {groomer.displayName}
          </h3>

          {/* Rating row */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-amber-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-gray-900">
              {formatRating(groomer.ratingAvg)}
            </span>
            <span className="text-sm text-gray-400">
              ({groomer.ratingCount})
            </span>
          </div>

          {/* Service tags */}
          {matchedServices.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {matchedServices.slice(0, 3).map((svc) => (
                <span
                  key={svc.name}
                  className="inline-block rounded-full bg-gray-50 px-2.5 py-0.5 text-xs text-gray-500"
                >
                  {svc.name}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          {lowestPrice !== null && (
            <p className="mt-3 text-[#4884B8] font-semibold">
              {formatPrice(lowestPrice)}起
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
