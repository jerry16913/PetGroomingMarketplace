export interface GroomerPortfolioItem {
  id: string;
  url: string;
  caption: string;
}

export interface GroomerService {
  serviceId: string;
  priceOverride?: number;
  durationOverride?: number;
}

export interface Groomer {
  id: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  ratingAvg: number;
  ratingCount: number;
  portfolio: GroomerPortfolioItem[];
  services: GroomerService[];
  status: 'pending' | 'approved' | 'suspended';
  email: string;
  phone: string;
  joinedAt: string;
}
