export interface Review {
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewsState {
  byProduct: Record<number, Review[]>;
  loading: Record<number, boolean>;
  error: string | null;
}

export const initialReviewsState: ReviewsState = {
  byProduct: {},
  loading: {},
  error: null,
};
