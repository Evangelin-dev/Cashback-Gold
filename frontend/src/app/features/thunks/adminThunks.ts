

import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../utils/axiosInstance';
import type { AdminProfileData, Ornament, PaginatedResponse, User } from '../../types/type';

export type UserType = 'partner' | 'b2b' | 'user';

interface FetchUsersPayload {
  userType: UserType;
  page: number;
  size: number;
}

interface UpdateUserStatusPayload {
  userId: number;
  action: 'approve' | 'reject';
  userType: UserType;
}

const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const err = error as { response?: { data?: { message?: string } } };
    if (err.response?.data?.message) {
      return err.response.data.message;
    }
  }
  if (error instanceof Error) return error.message;
  return 'An unknown server error occurred';
};


export interface OrnamentApiData {
  name: string;
  price: number;
  category: string;
  subCategory: string;
  item: string;
  customItem?: string;
  gender: string;
  description1: string;
  description2: string;
  description3: string;
  description: string;
  material: string;
  purity: string;
  quality: string;
  details: string;
  priceBreakups: Array<{
    component: string;
    goldRate18kt: number;
    weightG: number;
    discount: number;
    finalValue: number;
  }>;
}


interface AddOrnamentPayload {
  data: OrnamentApiData;
  mainImage: File;
  subImages: File[];
}


interface UpdateOrnamentPayload {
  id: number;
  data: OrnamentApiData;
  mainImage?: File | null;
  subImages?: File[];
}


interface FetchOrnamentsPayload {
  page: number;
  size: number;
}

export const addOrnament = createAsyncThunk<Ornament, AddOrnamentPayload>(
  'admin/addOrnament',
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify(payload.data)], { type: 'application/json' }));
      formData.append('mainImage', payload.mainImage);
      payload.subImages.forEach(file => {
        formData.append('subImages', file);
      });

      const response = await axiosInstance.post<Ornament>('/admin/ornaments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchAllOrnaments = createAsyncThunk<Ornament[], FetchOrnamentsPayload>(
  'admin/fetchAllOrnaments',
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<Ornament[]>('/admin/ornaments', {
        params: { page, size },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateOrnament = createAsyncThunk<Ornament, UpdateOrnamentPayload>(
  'admin/updateOrnament',
  async ({ id, data, mainImage, subImages }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

      if (mainImage) {
        formData.append('mainImage', mainImage);
      }
      if (subImages && subImages.length > 0) {
        subImages.forEach(file => {
          formData.append('subImages', file);
        });
      }

      const response = await axiosInstance.put<Ornament>(`/admin/ornaments/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteOrnament = createAsyncThunk<number, number>(
  'admin/deleteOrnament',
  async (ornamentId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admin/ornaments/${ornamentId}`);
      return ornamentId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchAdminProfile = createAsyncThunk<AdminProfileData>(
  'admin/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<AdminProfileData>('/api/admin/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchUsers = createAsyncThunk<
  { userType: UserType; data: PaginatedResponse<User> },
  FetchUsersPayload
>(
  'admin/fetchUsers',
  async ({ userType, page, size }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<PaginatedResponse<User>>('/admin/users', {
        params: { type: userType.toUpperCase(), page: page - 1, size },
      });
      return { userType, data: response.data };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);


export const updateUserStatus = createAsyncThunk<
  { updatedUser: User, userType: UserType },
  UpdateUserStatusPayload
>(
  'admin/updateUserStatus',
  async ({ userId, action, userType }, { rejectWithValue }) => {
    try {
      console.log(userId, action, userType , 'ummm');
      const res = await axiosInstance.put(`/admin/users/${userId}/${action}`);
      console.log(res, 'res');
      return { 
        updatedUser: { id: userId, status: action === 'approve' ? 'APPROVED' : 'REJECTED' } as User,
        userType
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);