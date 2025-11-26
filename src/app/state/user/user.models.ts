export interface Address {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface UserPreferences {
  newsletter: boolean;
  defaultMinRating?: number;
}

export interface OrderLine {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderSummary {
  id: string;
  date: string;
  status: 'en_cours' | 'expédiée' | 'livrée';
  total: number;
}

export interface OrderDetail extends OrderSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  address: Address;
  items: OrderLine[];
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  defaultAddress?: Address;
  preferences: UserPreferences;
}

export interface UserState {
  profile: UserProfile | null;
  orders: OrderSummary[];
  loading: boolean;
  error?: string;
}
