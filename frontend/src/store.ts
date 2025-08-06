import { configureStore } from '@reduxjs/toolkit';
import authReducer from './app/features/slices/authSlice';
import adminReducer from './app/features/slices/adminSlice';
import cartReducer from './app/features/slices/cartSlice';
import wishlistReducer from './app/features/slices/wishlistSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    cart: cartReducer,
    wishlist: wishlistReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
