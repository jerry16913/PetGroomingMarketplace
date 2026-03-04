import type { ServiceResourceRule } from '@/types';

export const serviceResourceRules: ServiceResourceRule[] = [
  // svc1: 狗狗洗澡 — bath required, dryer optional
  {
    serviceId: 'svc1',
    requirements: [
      { type: 'bath', count: 1, required: true },
      { type: 'dryer', count: 1, required: false },
    ],
  },
  // svc2: 狗狗美容 — groom_table required, bath required, dryer optional
  {
    serviceId: 'svc2',
    requirements: [
      { type: 'groom_table', count: 1, required: true },
      { type: 'bath', count: 1, required: true },
      { type: 'dryer', count: 1, required: false },
    ],
  },
  // svc3: 貓咪美容 — groom_table required, bath required, dryer optional
  {
    serviceId: 'svc3',
    requirements: [
      { type: 'groom_table', count: 1, required: true },
      { type: 'bath', count: 1, required: true },
      { type: 'dryer', count: 1, required: false },
    ],
  },
  // svc4: 小型犬美容 — groom_table required, bath required, dryer optional
  {
    serviceId: 'svc4',
    requirements: [
      { type: 'groom_table', count: 1, required: true },
      { type: 'bath', count: 1, required: true },
      { type: 'dryer', count: 1, required: false },
    ],
  },
  // svc5: 大型犬美容 — groom_table required, bath required, dryer required
  {
    serviceId: 'svc5',
    requirements: [
      { type: 'groom_table', count: 1, required: true },
      { type: 'bath', count: 1, required: true },
      { type: 'dryer', count: 1, required: true },
    ],
  },
  // svc6: 特殊造型 — groom_table required, bath required, dryer optional
  {
    serviceId: 'svc6',
    requirements: [
      { type: 'groom_table', count: 1, required: true },
      { type: 'bath', count: 1, required: true },
      { type: 'dryer', count: 1, required: false },
    ],
  },
  // svc7: 寵物 SPA — bath required, dryer optional
  {
    serviceId: 'svc7',
    requirements: [
      { type: 'bath', count: 1, required: true },
      { type: 'dryer', count: 1, required: false },
    ],
  },
  // svc14: 比賽造型 — groom_table required, bath required, dryer required
  {
    serviceId: 'svc14',
    requirements: [
      { type: 'groom_table', count: 1, required: true },
      { type: 'bath', count: 1, required: true },
      { type: 'dryer', count: 1, required: true },
    ],
  },
  // svc19: 中型犬美容 — groom_table required, bath required, dryer optional
  {
    serviceId: 'svc19',
    requirements: [
      { type: 'groom_table', count: 1, required: true },
      { type: 'bath', count: 1, required: true },
      { type: 'dryer', count: 1, required: false },
    ],
  },
  // svc20: 貓咪洗澡 — bath required, dryer optional
  {
    serviceId: 'svc20',
    requirements: [
      { type: 'bath', count: 1, required: true },
      { type: 'dryer', count: 1, required: false },
    ],
  },
];
