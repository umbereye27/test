import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addReview } from '../store/slices/reviewsSlice';
import type { ReviewFormData } from '../type/types';

interface ReviewFormProps {
  movieId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ movieId }) => {
  const dispatch = useAppDispatch();
  const { isSubmitting, error } = useAppSelector(state => state.reviews);
  
  const [formData, setFormData] = useState<ReviewFormData>({
    name: '',
    rating: 5,
    comment: '',
  });
  
  const [errors, setErrors] = useState<Partial<ReviewFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ReviewFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.comment.trim()) {
      newErrors.comment = 'Comment is required';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Comment must be at least 10 characters long';
    }
    
    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(addReview({ movieId, reviewData: formData })).unwrap();
      // Reset form on success
      setFormData({
        name: '',
        rating: 5,
        comment: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const handleInputChange = (field: keyof ReviewFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Write a Review
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#edb409] dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
              errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Rating
          </label>
          <div className="flex items-center space-x-2">
            <select
              id="rating"
              value={formData.rating}
              onChange={(e) => handleInputChange('rating', parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#edb409] dark:bg-gray-700 dark:text-white"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${
                    star <= formData.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.rating}</p>
          )}
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Comment
          </label>
          <textarea
            id="comment"
            rows={4}
            value={formData.comment}
            onChange={(e) => handleInputChange('comment', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#edb409] dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
              errors.comment ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Share your thoughts about this movie..."
          />
          {errors.comment && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.comment}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#edb409] text-white py-2 px-4 rounded-md hover:bg-[#c49608] focus:outline-none focus:ring-2 focus:ring-[#edb409] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;