export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  _id: string;
  titleText: { text: string };
  releaseYear?: { year: number };
  primaryImage?: { url: string };
  genres?: { genres: { text: string }[] };
  overview?: string;
  runtime?: number;
  tagline?: string;
  vote_average?: number;
}

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export interface WatchlistMovie extends Movie {
  overview: string;
  vote_average: number;
}

export interface Review {
  id: string;
  movieId: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface ReviewFormData {
  name: string;
  rating: number;
  comment: string;
}

export type Theme = 'light' | 'dark';