export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin" | "professional";
  companyName?: string;
  commercialName?: string;
  siret?: string;
  phone?: string;
  address?: string;
  zipCode?: string;
  city?: string;
  addressComplement?: string;
  bio?: string;
  avatar?: string;
  createdAt?: string;
  permissions?: string[];
  isActive?: boolean;
  kycStatus?: "pending" | "verified" | "rejected";
  status?: string;
  demandType?: string;
  latitude?: number;
  longitude?: number;
}
