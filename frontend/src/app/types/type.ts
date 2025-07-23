export interface User {
  id: number;
  email: string;
  mobile: string | null;
  role: 'USER' | 'PARTNER' | 'B2B' | 'ADMIN'; 
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export interface AuthState {
  currentUser: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export interface UserListState {
  users: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
export interface LoginOtpData {
  identifier: string;
}

export interface VerifyLoginOtpData {
  identifier: string;
  otp?: string;
}

export interface RegistrationData {
  fullName: string;
  gender: string;
  dob: string;
  email: string;
  mobile: string;
  countryCode: string;
  city: string;
  town: string;
  state: string;
  country: string;
  password: string;
  role: 'USER' | 'PARTNER' | 'B2B' | 'ADMIN';
}

export interface VerificationData extends RegistrationData {
  otp: string;
}

export interface ResendOtpData {
  email: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface LoginResponse extends ApiResponse {
  token: string;
  user: User;
}

export interface Ornament {
  id: number;
  name: string;
  price: number;
  meta: string;
  category: string;
  subCategory: string;
  item: string;
  customItem?: string;
  gender: 'Male' | 'Female' | 'Unisex';
  description: string;
  description1?: string;
  description2?: string;
  description3?: string;
  material: string;
  purity: string;
  quality: string;
  details: string;
  mainImage: string;
  subImages: string[];
}

export interface AdminState {
  ornaments: Ornament[];
  currentOrnament: Ornament | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  
  profile: AdminProfileData | null;
  profileStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  profileError: string | null;
  
  partnerUsers: UserListState;
  b2bUsers: UserListState;
  normalUsers: UserListState;
  actionStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export interface AdminProfileData {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  avatarUrl: string | null;
}