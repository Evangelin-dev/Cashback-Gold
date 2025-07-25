// src/features/thunks/cartThunks.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../utils/axiosInstance';
import type { CartItem } from '../../types/type'; // You'll need to define this type

const getErrorMessage = (error: unknown): string => {
  // Your existing getErrorMessage function...
  if (error instanceof Error) return error.message;
  return 'An unknown server error occurred';
};

// Thunk to get all items in the cart
export const fetchCart = createAsyncThunk<CartItem[]>(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<CartItem[]>('/api/cart');
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

interface AddToCartPayload {
  ornamentId: number;
  quantity: number;
}

export const addToCart = createAsyncThunk<CartItem, AddToCartPayload>(
  'cart/addToCart',
  async ({ ornamentId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<CartItem>(`/api/cart/add?ornamentId=${ornamentId}&qty=${quantity}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const removeFromCart = createAsyncThunk<number, { cartItemId: number }>(
    'cart/removeFromCart',
    async ({ cartItemId }, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/api/cart/${cartItemId}`);
            return cartItemId;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);


export const clearCart = createAsyncThunk<void>(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.delete('/api/cart/clear');
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk<CartItem, { cartItemId: number; quantity: number }>(
  'cart/updateQuantity',
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<CartItem>(`/api/cart/${cartItemId}`, { quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Thunk for checking out
export const checkoutCart = createAsyncThunk<void>(
    'cart/checkout',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.post('/api/orders/checkout-cart');
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);