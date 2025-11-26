export interface AdminTopProduct {
  productId: string;
  name: string;
  sold: number;
  revenue: number;
}

export interface AdminRecentOrder {
  id: string;
  user: string;
  total: number;
  createdAt: string;
  status: string;
}

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  topProducts: AdminTopProduct[];
  recentOrders: AdminRecentOrder[];
}

export interface AdminState {
  stats: AdminStats | null;
  loading: boolean;
  error: string | null;
}

export const initialAdminState: AdminState = {
  stats: null,
  loading: false,
  error: null,
};
