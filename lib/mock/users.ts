import type { User } from '@/types';

export const users: User[] = [
  {
    id: 'u1',
    email: 'customer@test.com',
    name: '王小明',
    role: 'customer',
  },
  {
    id: 'u2',
    email: 'pro@test.com',
    name: '李美容',
    role: 'groomer',
    groomerId: 'p1',
  },
  {
    id: 'u3',
    email: 'admin@test.com',
    name: '管理員',
    role: 'admin',
  },
];
