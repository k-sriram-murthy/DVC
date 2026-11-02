export const UserRole = {
  DIRECTOR: "DIRECTOR",
  PROJECT_MANAGER: "PROJECT_MANAGER",
  SITE_SUPERVISOR: "SITE_SUPERVISOR",
  CUSTOMER: "CUSTOMER",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const ProjectStatus = {
  ACTIVE: "ACTIVE",
  ON_HOLD: "ON_HOLD",
  COMPLETED: "COMPLETED",
  ARCHIVED: "ARCHIVED",
} as const;
export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const AssignmentRole = {
  PROJECT_MANAGER: "PROJECT_MANAGER",
  SITE_SUPERVISOR: "SITE_SUPERVISOR",
  CUSTOMER: "CUSTOMER",
} as const;
export type AssignmentRole = (typeof AssignmentRole)[keyof typeof AssignmentRole];

export const VendorType = {
  MATERIAL: "MATERIAL",
  LABOUR: "LABOUR",
  BOTH: "BOTH",
} as const;
export type VendorType = (typeof VendorType)[keyof typeof VendorType];

export const ExpenseType = {
  MATERIAL: "MATERIAL",
  LABOUR: "LABOUR",
} as const;
export type ExpenseType = (typeof ExpenseType)[keyof typeof ExpenseType];

export const ApprovalStatus = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;
export type ApprovalStatus = (typeof ApprovalStatus)[keyof typeof ApprovalStatus];

export const PaymentStatus = {
  UNPAID: "UNPAID",
  PARTIALLY_PAID: "PARTIALLY_PAID",
  PAID: "PAID",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentMethod = {
  UPI: "UPI",
  BANK_TRANSFER: "BANK_TRANSFER",
  CASH: "CASH",
  CHEQUE: "CHEQUE",
  OTHER: "OTHER",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PhotoVisibility = {
  INTERNAL: "INTERNAL",
  CUSTOMER_VISIBLE: "CUSTOMER_VISIBLE",
} as const;
export type PhotoVisibility = (typeof PhotoVisibility)[keyof typeof PhotoVisibility];

export const ReceiptType = {
  FORMAL_INVOICE: "FORMAL_INVOICE",
  HANDWRITTEN_RECEIPT: "HANDWRITTEN_RECEIPT",
  NO_FORMAL_INVOICE: "NO_FORMAL_INVOICE",
  OTHER: "OTHER",
} as const;
export type ReceiptType = (typeof ReceiptType)[keyof typeof ReceiptType];
