import { z } from "zod";

// Order Schema
export const OrderSchema = z.object({
  fullName: z.string().min(1, "নাম আবশ্যক"),
  mobileNumber: z.string().min(11, "সঠিক মোবাইল নম্বর দিন"),
  fullAddress: z.string().min(10, "সম্পূর্ণ ঠিকানা দিন"),
  productId: z.number(),
  quantity: z.number().min(1),
});

export type OrderType = z.infer<typeof OrderSchema>;

// Product Schema
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  originalPrice: z.number().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  stockQuantity: z.number().default(0),
});

export type ProductType = z.infer<typeof ProductSchema>;

// Admin User Schema
export const AdminUserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  isActive: z.boolean().default(true),
});

export type AdminUserType = z.infer<typeof AdminUserSchema>;

// Order Status Type
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

// Database Order Schema
export const DatabaseOrderSchema = z.object({
  id: z.number(),
  orderNumber: z.string(),
  fullName: z.string(),
  mobileNumber: z.string(),
  fullAddress: z.string(),
  productId: z.number(),
  quantity: z.number(),
  unitPrice: z.number(),
  shippingCharge: z.number(),
  totalAmount: z.number(),
  status: z.string(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Customer Schema
export const CustomerSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  mobileNumber: z.string(),
  fullAddress: z.string(),
  email: z.string().optional(),
  totalOrders: z.number().default(0),
  totalSpent: z.number().default(0),
  lastOrderDate: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CustomerType = z.infer<typeof CustomerSchema>;
