import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const chat = pgTable("chat", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const message = pgTable("message", {
  id: text("id").primaryKey(),
  chatId: text("chat_id")
    .notNull()
    .references(() => chat.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // 'user' or 'chatbot'
  sendAt: timestamp("send_at").notNull(),
});

export const order = pgTable("order", {
  id: text("id").primaryKey(),
  customerId: text("costumer_id")
    .notNull()
    .references(() => customer.id, { onDelete: "cascade" }),
  orderStatus: text("order_status").notNull(),
  orderPurchaseTimestamp: timestamp("order_purchase_timestamp").notNull(),
  orderApprovedAt: timestamp("order_approved_at").notNull(),
  orderDeliveredCarrierDate: timestamp(
    "order_delivered_carrier_date"
  ).notNull(),
  orderDeliveredCustomerDate: timestamp(
    "order_delivered_customer_date"
  ).notNull(),
  orderEstimatedDeliveryDate: timestamp(
    "order_estimated_delivery_date"
  ).notNull(),
});

export const customer = pgTable("customer", {
  id: text("id").primaryKey(),
  customerUniqueId: text("customer_unique_id").notNull(),
  customerZipCodePrefix: text("customer_zip_code_prefix").notNull(),
  customerCity: text("customer_city").notNull(),
  customerState: text("customer_state").notNull(),
});
