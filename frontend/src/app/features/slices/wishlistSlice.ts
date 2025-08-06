// src/features/slices/wishlistSlice.ts

import { createSlice } from '@reduxjs/toolkit';
import type { WishlistState, PaginatedWishlistResponse } from '../../types/type';
import { fetchWishlist, addToWishlist, removeFromWishlist, fetchWishlistCount } from '../thunks/wishlistThunks';

const initialState: WishlistState = {
    items: [],
    status: 'idle',
    error: null,
    count: 0,
    currentPage: 0,
    totalPages: 0,
    isLastPage: true,
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        clearWishlist: (state) => {
            state.items = [];
            state.count = 0;
            state.status = 'idle';
            state.currentPage = 0;
            state.totalPages = 0;
            state.isLastPage = true;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handling fetchWishlist (with pagination)
            .addCase(fetchWishlist.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.status = 'succeeded';
                
                // ***** THE FIX IS HERE *****
                // Defensively check if action.payload.items is an array. Default to an empty array if not.
                // This prevents crashes if the payload is malformed.
                const newItems = Array.isArray(action.payload.items) ? action.payload.items : [];

                // If it's the first page, replace items. Otherwise, append.
                if (action.meta.arg.page === 0) {
                    state.items = newItems;
                } else {
                    state.items.push(...newItems);
                }
                
                // Update pagination state, providing fallbacks for safety.
                state.currentPage = action.payload.page ?? 0;
                state.totalPages = action.payload.totalPages ?? 0;
                state.isLastPage = state.currentPage >= state.totalPages - 1;
                state.count = action.payload.totalElements ?? 0;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // Handling addToWishlist
            .addCase(addToWishlist.fulfilled, (state, action) => {
                // Ensure payload is valid before proceeding
                if (action.payload && action.payload.ornamentId) {
                    const exists = state.items.some(item => item.ornamentId === action.payload.ornamentId);
                    if (!exists) {
                        state.items.unshift(action.payload);
                        state.count += 1;
                    }
                }
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                console.error("Failed to add to wishlist:", action.payload);
                state.error = action.payload as string;
            })

            // Handling removeFromWishlist
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                const ornamentId = action.payload;
                const initialLength = state.items.length;
                state.items = state.items.filter(item => item.ornamentId !== ornamentId);
                // Only decrement count if an item was actually removed
                if (state.items.length < initialLength && state.count > 0) {
                    state.count -= 1;
                }
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                console.error("Failed to remove from wishlist:", action.payload);
                state.error = action.payload as string;
            })

            // Handling fetchWishlistCount
            .addCase(fetchWishlistCount.fulfilled, (state, action) => {
                state.count = action.payload;
            });
    },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;