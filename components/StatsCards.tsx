import React from 'react';
import Card from '@/components/ui/Card';

interface StatItem {
  label: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
}

interface StatsCardsProps {
  stats: StatItem[];
  className?: string;
}

export default function StatsCards({ stats, className = '' }: StatsCardsProps) {
  return (
    <div className={`grid grid-cols-2 gap-4 lg:grid-cols-4 ${className}`}>
      {stats.map((stat) => {
        // Determine change color
        const isPositive = stat.change?.startsWith('+');
        const isNegative = stat.change?.startsWith('-');

        return (
          <Card key={stat.label}>
            <div className="flex items-start gap-3">
              {/* Icon */}
              {stat.icon && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  {stat.icon}
                </div>
              )}

              <div className="min-w-0 flex-1">
                {/* Label */}
                <p className="text-sm text-gray-500 truncate">{stat.label}</p>

                {/* Value */}
                <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>

                {/* Change indicator */}
                {stat.change && (
                  <p
                    className={`mt-1 text-sm font-medium ${
                      isPositive
                        ? 'text-green-600'
                        : isNegative
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {isPositive && (
                      <svg
                        className="mr-0.5 inline-block h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                    )}
                    {isNegative && (
                      <svg
                        className="mr-0.5 inline-block h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    )}
                    {stat.change}
                  </p>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
