import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import type { Review, ReviewFormData } from '../../type/types';

interface ReviewsState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
}

const initialState: ReviewsState = {
  reviews: [],
  isLoading: false,
  error: null,
  isSubmitting: false,
};

// Fetch reviews for a specific movie
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (movieId: string) => {
    try {
      const reviewsRef = collection(db, 'reviews');
      const q = query(
        reviewsRef,
        where('movieId', '==', movieId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const reviews: Review[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reviews.push({
          id: doc.id,
          movieId: data.movieId,
          name: data.name,
          rating: data.rating,
          comment: data.comment,
          createdAt: data.createdAt.toDate(),
        });
      });
      
      return reviews;
    } catch (error) {
      throw new Error('Failed to fetch reviews');
    }
  }
);

// Add a new review
export const addReview = createAsyncThunk(
  'reviews/addReview',
  async ({ movieId, reviewData }: { movieId: string; reviewData: ReviewFormData }) => {
    try {
      const reviewsRef = collection(db, 'reviews');
      const newReview = {
        movieId,
        name: reviewData.name,
        rating: reviewData.rating,
        comment: reviewData.comment,
        createdAt: Timestamp.now(),
      };
      
      const docRef = await addDoc(reviewsRef, newReview);
      
      return {
        id: docRef.id,
        movieId,
        name: reviewData.name,
        rating: reviewData.rating,
        comment: reviewData.comment,
        createdAt: new Date(),
      } as Review;
    } catch (error) {
      throw new Error('Failed to add review');
    }
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews cases
      .addCase(fetchReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch reviews';
      })
      // Add review cases
      .addCase(addReview.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.reviews.unshift(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Failed to add review';
      });
  },
});

export const { clearReviews, clearError } = reviewsSlice.actions;
export default reviewsSlice.reducer;