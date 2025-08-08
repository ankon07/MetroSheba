import { PaymentMethod, User } from "@/types";

export const mockUser: User = {
  id: "u1",
  firstName: "Ankon",
  lastName: "Ahamed",
  email: "ankon@iut-dhaka.edu",
  phone: "+8801234567890",
  nationality: "Bangladeshi",
  profileImage: "",
  trips: 12,
  countries: 1,
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