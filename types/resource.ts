export type ResourceType = 'groom_table' | 'bath' | 'dryer';

export interface Resource {
  id: string;
  locationId: string;
  type: ResourceType;
  name: string;
  isActive: boolean;
  tags?: string[];
  notes?: string;
}
