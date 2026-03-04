export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'groomer' | 'admin';
  groomerId?: string;
}
