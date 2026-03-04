'use client';

import React from 'react';
import type { ResourceType } from '@/types';
import ResourceBadge from '@/components/ResourceBadge';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';

export type ResourceAssignment = {
  type: ResourceType;
  resourceId: string;
  resourceName: string;
  required: boolean;
};

interface ResourceAutoAssignPanelProps {
  assignments: ResourceAssignment[];
  loading?: boolean;
}

export default function ResourceAutoAssignPanel({
  assignments,
  loading = false,
}: ResourceAutoAssignPanelProps) {
  if (loading) {
    return (
      <Card>
        <div className="flex flex-col gap-3">
          <Skeleton variant="text" width={120} height={16} />
          <Skeleton variant="rect" height={32} />
          <Skeleton variant="rect" height={32} />
        </div>
      </Card>
    );
  }

  if (assignments.length === 0) {
    return (
      <p className="text-sm text-gray-400">
        此服務無需空間資源
      </p>
    );
  }

  return (
    <Card>
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold text-gray-900">
          資源分配結果
        </h4>

        <ul className="flex flex-col gap-2">
          {assignments.map((assignment) => (
            <li
              key={assignment.resourceId}
              className="flex items-center justify-between gap-2"
            >
              <ResourceBadge
                type={assignment.type}
                name={assignment.resourceName}
              />
              <Badge
                variant={assignment.required ? 'success' : 'default'}
                size="sm"
              >
                {assignment.required ? '必要' : '選配'}
              </Badge>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
