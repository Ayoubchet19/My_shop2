export interface IProductRating {
  user_id: number;
  value: number;
}

export interface IProduct {
  id: number;
  name: string;
  price: number;
  created_at: string;
  owner_id: number;
  ratings: IProductRating[];
  _avg: number;
}

export interface IProducts {
  count: number;
  next: string | null;
  previous: string | null;
  results: IProduct[];
}

export interface ProductRating {
  product_id: number;
  avg_rating: number;
  count: number;
}

export interface ProductsParams {
  page: number;
  pageSize: number;
  minRating: number;
  ordering: string;
}
