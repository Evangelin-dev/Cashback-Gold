// src/features/thunks/wishlistThunks.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../utils/axiosInstance';
import type { WishlistItem, PaginatedWishlistResponse } from '../../types/type';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return 'An unknown server error occurred';
};

// Thunk to fetch a paginated list of wishlist items
export const fetchWishlist = createAsyncThunk<PaginatedWishlistResponse, { page: number; size: number }>(
  'wishlist/fetchWishlist',
  async ({ page = 0, size = 30 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<PaginatedWishlistResponse>(`/api/wishlist?page=${page}&size=${size}`);
      console.log(response.data,'wishh')
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Thunk to add an item to the wishlist
export const addToWishlist = createAsyncThunk<WishlistItem, { ornamentId: number }>(
  'wishlist/addToWishlist',
  async ({ ornamentId }, { rejectWithValue }) => {
    try {
      // Assuming the API returns the added ornament/wishlist item
      const response = await axiosInstance.post<WishlistItem>(`/api/wishlist/${ornamentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Thunk to remove an item from the wishlist
export const removeFromWishlist = createAsyncThunk<number, { ornamentId: number }>(
  'wishlist/removeFromWishlist',
  async ({ ornamentId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/wishlist/${ornamentId}`);
      // Return the ID so we can remove it from the state
      return ornamentId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Thunk to get the total count of items in the wishlist
export const fetchWishlistCount = createAsyncThunk<number>(
  'wishlist/fetchCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<number>('/api/wishlist/count');
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Thunk to check if a specific item exists in the wishlist
export const checkIfInWishlist = createAsyncThunk<boolean, { ornamentId: number }>(
  'wishlist/checkIfExists',
  async ({ ornamentId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<boolean>(`/api/wishlist/exists/${ornamentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);