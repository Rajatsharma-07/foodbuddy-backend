export enum ROLES {
  ADMIN = "admin",
  PSUEDO_ADMIN = "psuedo_admin",
  CAPTAIN = "captain",
}

export enum TABLE_STATUS {
  AVAILABLE = "available",
  OCCUPIED = "occupied",
  RESERVED = "reserved",
  CLEANING = "cleaning",
  BLOCKED = "blocked",
  ORDER_PLACED = "order_placed",
  FOOD_SERVED = "food_served",
  BILLING_IN_PROGRESS = "billing_in_progress",
  PAYMENT_PENDING = "payment_pending",
  PAYMENT_RECEIVED = "payment_received",
}

export const BCRYPT_ROUNDS = 10;
