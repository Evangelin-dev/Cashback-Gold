import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type {
  VerifyLoginOtpData,
  LoginOtpData,
  RegistrationData,
  VerificationData,
  LoginResponse,
  ResendOtpData,
  ApiResponse
} from '../../types/type';


const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/auth`;
console.log("Data",import.meta.env.VITE_BACKEND_URL);


const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};


export const sendLoginOtp = createAsyncThunk<ApiResponse, LoginOtpData>(
  'auth/sendLoginOtp',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse>(`${API_BASE_URL}/login-otp`, {
        identifier: loginData.identifier,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const verifyLoginOtp = createAsyncThunk<LoginResponse, VerifyLoginOtpData>(
  'auth/verifyLoginOtp',
  async (verificationData, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/verify-otp2`, {
        identifier: verificationData.identifier,
        otp: verificationData.otp,
      });
      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);


export const sendRegistrationOtp = createAsyncThunk<ApiResponse, RegistrationData>(
  'auth/sendRegistrationOtp',
  async (userData, { rejectWithValue }) => {
    try {
    
      let url = `${API_BASE_URL}/register`;
      if (userData.referralCode) {
        url += `?ref=${userData.referralCode}`;
      }

      const response = await axios.post<ApiResponse>(url, {
        fullName: userData.fullName,
        gender: userData.gender,
        dob: userData.dob,
        email: userData.email,
        mobile: userData.mobile,
        countryCode: userData.countryCode,
        city: userData.city,
        town: userData.town,
        state: userData.state,
        country: userData.country,
        password: userData.password,
        role: userData.role,
      });

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);


export const verifyOtpAndRegister = createAsyncThunk<LoginResponse, VerificationData>(
  'auth/verifyOtpAndRegister',
  async (verificationData, { rejectWithValue }) => {
    try {
    
      const payload: any = {
        identifier: verificationData.email,
        otp: verificationData.otp,
        fullName: verificationData.fullName,
        gender: verificationData.gender,
        dob: verificationData.dob,
        mobile: verificationData.mobile,
        countryCode: verificationData.countryCode,
        city: verificationData.city,
        town: verificationData.town,
        state: verificationData.state,
        country: verificationData.country,
        password: verificationData.password,
        role: verificationData.role,
      };

      if (verificationData.referralCode) {
        payload.referralCode = verificationData.referralCode;
      }

      const response = await axios.post<any>(`${API_BASE_URL}/verify-otp`, payload);

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);


export const resendOtp = createAsyncThunk<ApiResponse, ResendOtpData>(
  'auth/resendOtp',
  async (resendData, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse>(`${API_BASE_URL}/resend-otp`, {
        identifier: resendData.email,
        role: 'USER',
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
