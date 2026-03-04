import type { Resource } from '@/types';

export const resources: Resource[] = [
  // ── Groom Tables (美容台) ──
  { id: 'res1', locationId: 'loc1', type: 'groom_table', name: '美容台 1', isActive: true, tags: ['大型犬'] },
  { id: 'res2', locationId: 'loc1', type: 'groom_table', name: '美容台 2', isActive: true, tags: ['中小型犬'] },
  { id: 'res3', locationId: 'loc1', type: 'groom_table', name: '美容台 3', isActive: true, tags: ['中小型犬'] },
  { id: 'res4', locationId: 'loc1', type: 'groom_table', name: '美容台 4', isActive: false, tags: ['維修中'], notes: '設備維護中，預計下週恢復' },

  // ── Baths (洗澡台) ──
  { id: 'res5', locationId: 'loc1', type: 'bath', name: '洗澡台 1', isActive: true, tags: ['大型犬', 'SPA'] },
  { id: 'res6', locationId: 'loc1', type: 'bath', name: '洗澡台 2', isActive: true, tags: ['中小型犬'] },
  { id: 'res7', locationId: 'loc1', type: 'bath', name: '洗澡台 3', isActive: true, tags: ['中小型犬'] },

  // ── Dryers (烘毛區) ──
  { id: 'res8', locationId: 'loc1', type: 'dryer', name: '烘毛區 1', isActive: true, tags: ['站立式'] },
  { id: 'res9', locationId: 'loc1', type: 'dryer', name: '烘毛區 2', isActive: true, tags: ['箱式'] },
  { id: 'res10', locationId: 'loc1', type: 'dryer', name: '烘毛區 3', isActive: false, notes: '待更換濾網' },
];
