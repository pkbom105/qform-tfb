// Customer Profile
export interface CustomerProfile {
  name: string;
  email: string;
  company: string;
  contact: string;
  line_id: string;
}

// Size Data
export interface SizeEntry {
  qty: string;
  chest: string;
}

export type SizeData = Record<string, SizeEntry>;

// Product Specification
export interface ProductSpecification {
  category: string;
  material: string;
  details: string;
  size_breakdown: SizeData;
  total_qty: number | string;
}

// Decoration Item
export interface DecorationItem {
  title: string;
  size: string;
}

// Decoration Details
export interface DecorationDetails {
  printing_title: string;
  printing_size: string;
  printing_pos2_title: string;
  printing_pos2_size: string;
  printing_pos3_title: string;
  printing_pos3_size: string;
  printing_pos4_title: string;
  printing_pos4_size: string;
  embroidery_title: string;
  embroidery_size: string;
  embroidery_pos2_title: string;
  embroidery_pos2_size: string;
  embroidery_pos3_title: string;
  embroidery_pos3_size: string;
  embroidery_pos4_title: string;
  embroidery_pos4_size: string;
  additional: string;
}

// Decoration Tab (order set)
export interface DecorationTab {
  id: string;
  productType: string;
  fabricType: string;
  specs: string;
  sizeData: Record<string, { qty: string; chest: string }>;
  totalQuantity: number;
  manualTotal: string;
  printTitle: string;
  printSize: string;
  printPos2Title: string;
  printPos2Size: string;
  printPos3Title: string;
  printPos3Size: string;
  printPos4Title: string;
  printPos4Size: string;
  embroideryTitle: string;
  embroiderySize: string;
  embroideryPos2Title: string;
  embroideryPos2Size: string;
  embroideryPos3Title: string;
  embroideryPos3Size: string;
  embroideryPos4Title: string;
  embroideryPos4Size: string;
  additionalNeeds: string;
  selectedFiles: File[];
}

// Quotation Data (for A4 Report)
export interface QuotationData {
  customer_profile: CustomerProfile;
  product_specification: ProductSpecification;
  decoration_details: DecorationDetails;
  design_images: string[];
}

// Set Color Theme
export interface SetColor {
  border: string;
  text: string;
  bg: string;
  lightBg: string;
  ring: string;
  accent: string;
}

// Product Type
export interface ProductType {
  label: string;
  value: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalCustomers: number;
  monthlyOrders: number[];
  revenueData: number[];
  popularProducts: { name: string; count: number }[];
}

// Customer Record
export interface CustomerRecord {
  id: number;
  name: string;
  email: string;
  company: string;
  phone: string;
  lineId: string;
  totalOrders: number;
  lastOrderDate: string;
  status: "active" | "inactive";
}

// Order Record
export interface OrderRecord {
  id: number;
  customerName: string;
  company: string;
  productType: string;
  quantity: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
  totalAmount?: number;
}