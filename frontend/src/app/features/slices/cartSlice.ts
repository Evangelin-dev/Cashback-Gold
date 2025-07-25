import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, CartState } from '../../types/type'; // Define these types
import { fetchCart, addToCart, removeFromCart, checkoutCart, updateCartItemQuantity, clearCart } from '../thunks/cartThunks';


const initialState: CartState = {
    items: [],
    status: 'idle',
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Handling fetchCart
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
                const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
                if (existingIndex !== -1) {
                    state.items[existingIndex] = action.payload;
                } else {
                    state.items.push(action.payload);
                }
            })
            .addCase(addToCart.rejected, (state, action) => {
                console.error("Failed to add to cart:", action.payload);
            })

            .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<number>) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.items = [];
            })
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                const updatedItem = action.payload;
                const existingItem = state.items.find(item => item.id === updatedItem.id);
                if (existingItem) {
                    existingItem.quantity = updatedItem.quantity;
                }
            })
            .addCase(checkoutCart.fulfilled, (state) => {
                state.items = [];
            });
    },
});

export default cartSlice.reducer;