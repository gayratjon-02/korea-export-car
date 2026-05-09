// ==========================================
// Korea Car Import — Shared Types
// ==========================================

// ---------- Enums ----------

export enum UserRole {
  USER = 'user',
  AGENT = 'agent',
  ADMIN = 'admin',
}

export enum CarCondition {
  NEW = 'new',
  USED = 'used',
}

export enum FuelType {
  GASOLINE = 'gasoline',
  DIESEL = 'diesel',
  HYBRID = 'hybrid',
  ELECTRIC = 'electric',
  LPG = 'lpg',
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  AUDIO = 'audio',
  SYSTEM = 'system',
}

export enum CustomsRateStatus {
  DRAFT = 'draft',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum CountryCode {
  UZ = 'UZ', // O'zbekiston
  KZ = 'KZ', // Qozog'iston
  KG = 'KG', // Qirg'iziston
  TJ = 'TJ', // Tojikiston
  RU = 'RU', // Rossiya
  AE = 'AE', // Dubay (BAA)
}

// ---------- User Types ----------

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  country?: string;
  city?: string;
  phone?: string;
  avatarUrl?: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAgent {
  id: string;
  userId: string;
  companyName: string;
  address?: string;
  license?: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ---------- Car Types ----------

export interface ICar {
  id: string;
  agentId: string;
  brand: string;
  model: string;
  year: number;
  engineCc: number;
  fuelType: FuelType;
  priceKrw: number;
  priceUsd: number;
  condition: CarCondition;
  mileage?: number;
  color?: string;
  description?: string;
  isActive: boolean;
  media: ICarMedia[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICarMedia {
  id: string;
  carId: string;
  url: string;
  type: MediaType;
  sortOrder: number;
}

// ---------- Location Types ----------

export interface ICountry {
  id: string;
  name: string;
  code: CountryCode;
  nameUz?: string;
}

export interface ICity {
  id: string;
  countryId: string;
  name: string;
  nameUz?: string;
}

// ---------- Customs & Shipping Types ----------

export interface ICustomsRate {
  id: string;
  countryId: string;
  formulaData: ICustomsFormula;
  status: CustomsRateStatus;
  updatedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface ICustomsFormula {
  baseDutyPercent: number;
  engineCcRate?: number;
  vatPercent: number;
  exciseRate?: number;
  usedCarMultiplier?: number;
  electricExemption: boolean;
  utilizationFee?: number;
  additionalFees?: Record<string, number>;
  notes?: string;
}

export interface IShippingRate {
  id: string;
  cityId: string;
  originPort: string;
  priceUsd: number;
  updatedAt: Date;
}

// ---------- Calculator Types ----------

export interface ICalculationRequest {
  carId: string;
  countryCode: CountryCode;
  cityId: string;
}

export interface ICalculationResult {
  carPrice: {
    krw: number;
    usd: number;
  };
  shipping: {
    amount: number;
    route: string;
  };
  customs: {
    baseDuty: number;
    vat: number;
    excise?: number;
    utilizationFee?: number;
    registrationFee?: number;
    additionalFees?: Record<string, number>;
    subtotal: number;
  };
  insurance: {
    amount: number;
    note: string;
  };
  additionalCosts: {
    brokerFee?: number;
    inspectionFee?: number;
  };
  total: number;
  currency: string;
  disclaimer: string;
}

// ---------- Chat Types ----------

export interface IChatRoom {
  id: string;
  userId: string;
  agentId: string;
  carId: string;
  calculationData?: ICalculationResult;
  lastMessageAt?: Date;
  createdAt: Date;
}

export interface IMessage {
  id: string;
  roomId: string;
  senderId: string;
  type: MessageType;
  content: string;
  mediaUrl?: string;
  isRead: boolean;
  createdAt: Date;
}

// ---------- Auth Types ----------

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

// ---------- API Response Types ----------

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---------- Filter Types ----------

export interface ICarFilter {
  brand?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  engineCcFrom?: number;
  engineCcTo?: number;
  priceFrom?: number;
  priceTo?: number;
  fuelType?: FuelType;
  condition?: CarCondition;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
