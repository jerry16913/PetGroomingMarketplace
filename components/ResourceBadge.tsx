import React from 'react';
import type { ResourceType } from '@/types';

interface ResourceBadgeProps {
  type: ResourceType;
  name: string;
  className?: string;
}

const typeIcons: Record<ResourceType, string> = {
  groom_table: '\u2702\uFE0F',
  bath: '\uD83D\uDEBF',
  dryer: '\uD83D\uDCA8',
};

const typeLabels: Record<ResourceType, string> = {
  groom_table: '\u7F8E\u5BB9\u53F0',
  bath: '\u6D17\u6FA1\u53F0',
  dryer: '\u70D8\u6BDB\u5340',
};

export { typeIcons as resourceTypeIcons, typeLabels as resourceTypeLabels };

export default function ResourceBadge({
  type,
  name,
  className = '',
}: ResourceBadgeProps) {
  const icon = typeIcons[type];
  const label = typeLabels[type];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full bg-gray-100
        px-2.5 py-1 text-xs font-medium text-gray-700
        ${className}
      `}
      title={label}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{name}</span>
    </span>
  );
}
