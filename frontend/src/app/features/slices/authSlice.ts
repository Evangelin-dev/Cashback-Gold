import { createSlice } from '@reduxjs/toolkit';
import { 
  sendRegistrationOtp, 
  verifyOtpAndRegister, 
  resendOtp, 
  verifyLoginOtp,
  sendLoginOtp
} from '../thunks/authThunks';
import type { AuthState, User } from '../../types/type';

const getInitialUser = (): User | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

const getInitialToken = (): string | null => {
  return localStorage.getItem('authToken');
};

const initialState: AuthState = {
  currentUser: getInitialUser(),
  token: getInitialToken(),
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.currentUser = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
    },
  
    clearAuthError: (state) => {
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(sendLoginOtp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(sendLoginOtp.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(sendLoginOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      .addCase(verifyLoginOtp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
        localStorage.setItem('authToken', action.payload.token);
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
    
      .addCase(sendRegistrationOtp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(sendRegistrationOtp.fulfilled, (state) => {
        state.status = 'succeeded';
      
      })
      .addCase(sendRegistrationOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

    
      .addCase(verifyOtpAndRegister.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyOtpAndRegister.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(verifyOtpAndRegister.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

    
      .addCase(resendOtp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.status = 'succeeded';
      
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logoutUser, clearAuthError } = authSlice.actions;

export default authSlice.reducer;