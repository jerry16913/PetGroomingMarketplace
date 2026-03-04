import React from 'react';
import type { Review } from '@/types';
import { formatRating, formatDate } from '@/lib/format';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';

interface ReviewListProps {
  reviews: Review[];
  className?: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewList({ reviews, className = '' }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        title="尚無評價"
        description="目前還沒有任何評價"
        icon={
          <svg
            className="h-12 w-12 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        }
      />
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {reviews.map((review) => (
        <Card key={review.id}>
          <div className="flex flex-col gap-3">
            {/* Header: name, rating, date */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                  {review.customerName.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{review.customerName}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <StarRating rating={review.rating} />
                    <span className="text-xs text-gray-500">{formatRating(review.rating)}</span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
            </div>

            {/* Comment */}
            {review.comment && (
              <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
