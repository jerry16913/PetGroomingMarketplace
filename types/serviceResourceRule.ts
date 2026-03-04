import type { ResourceType } from './resource';

export interface ServiceResourceRequirement {
  type: ResourceType;
  count: number;
  required: boolean;
}

export interface ServiceResourceRule {
  serviceId: string;
  requirements: ServiceResourceRequirement[];
}
