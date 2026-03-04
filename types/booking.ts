export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  groomerId: string;
  serviceId: string;
  petId?: string;
  startAt: string;
  endAt: string;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  assignedResourceIds: string[];
  notes?: string;
  createdAt: string;
}
