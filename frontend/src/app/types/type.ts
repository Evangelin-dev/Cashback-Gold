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
  referralCode?: string | null;
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
  totalGram: number; // total gram
  price: number; // legacy field for backend compatibility
  gramPrice?: number; // per gram price (optional for backward compatibility)
  totalPrice?: number; // calculated (optional for backward compatibility)
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
  priceBreakups: PriceBreakup[];
  itemType: string | null;
  warranty: string;
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

export interface PriceBreakup {
  id: number;
  component: string;
  goldRate18kt: number;
  netWeight: number;
  grossWeight: number;
  discount: number;
  finalValue: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  subCategory: string;
  gender: string;
  description: string;
  mainImage: string;
  subImages: string[];
  material: string;
  purity: string;
  quality: string;
  warranty: string;
  details: string;
  itemType: string | null;
  priceBreakups: PriceBreakup[];
  totalPrice?: number;
  totalGram?: number;
}

export interface CartItem {
  id: number;         // This is the unique ID of the cart entry, e.g., 24, 25
  userId: number;
  ornament: Ornament; // The full product details are nested here
  quantity: number;
  createdAt: string;
}


export interface CartState {
  items: CartItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface KycData {
  id: number;
  userId: number;
  userType: 'USER' | 'PARTNER' | 'B2B' | 'ADMIN'
  aadharUrl: string | null;
  gstCertificateUrl: string | null;
  panCardUrl: string | null;
  addressProofUrl: string | null;
  bankStatementUrl: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED'; 
  submittedAt: string;
}

export interface UserProfile {
  fullName: string;
  dob: string;
  gender: string;
  email: string;
  mobile: string;
  city: string;
  town: string;
  state: string;
  country: string;
}

// src/types/type.ts

// Assuming a WishlistItem has a structure similar to an ornament/product
export interface WishlistItem {
  ornamentId: number;
  name: string;
  mainImage: string;
  category: string;
  itemType: string;
  purity: string;
  totalPrice: number;
}

// This now EXACTLY matches the paginated response from your API
export interface PaginatedWishlistResponse {
    items: WishlistItem[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

// This is the shape of the Wishlist state inside your Redux store
export interface WishlistState {
  items: WishlistItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // For UI state
  error: string | null; // For UI state
  count: number;
  currentPage: number;
  totalPages: number;
  isLastPage: boolean;
}