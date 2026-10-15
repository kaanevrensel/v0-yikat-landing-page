// Public response contract only. Credentials and provider requests live in lib/server/.
export type GoogleReview = {
  id: string;
  author: string;
  authorPhotoUrl?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export type GoogleReviewsResult =
  | { status: "ready"; reviews: GoogleReview[]; syncedAt: string }
  | { status: "disabled" | "unavailable" };
