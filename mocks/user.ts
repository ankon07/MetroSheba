import { PaymentMethod, User } from "@/types";

export const mockUser: User = {
  id: "u1",
  firstName: "Alex",
  lastName: "Johnson",
  email: "alex.johnson@example.com",
  phone: "+44 123 456 7890",
  nationality: "United Kingdom",
  profileImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
  trips: 12,
  countries: 7,
  miles: 1450,
  memberSince: "2023-01-15",
  membershipLevel: "Gold",
};

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm1",
    type: "visa",
    lastFour: "1234",
    expiryDate: "10/25",
    isDefault: true,
  },
  {
    id: "pm2",
    type: "mastercard",
    lastFour: "5678",
    expiryDate: "08/26",
    isDefault: false,
  },
  {
    id: "pm3",
    type: "paypal",
    lastFour: "",
    expiryDate: "",
    isDefault: false,
  },
];