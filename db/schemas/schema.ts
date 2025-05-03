import { numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";
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
  role: text("role").notNull(), // 'user' or 'chatbot'
  sendAt: timestamp("send_at").notNull(),
});
export const customer = pgTable("customer", {
  id: text().primaryKey(),
  customer_unique_id: text().notNull(),
  customer_zip_code_prefix: text().notNull(),
  customer_city: text().notNull(),
  customer_state: text().notNull(),
});

export const geolocation = pgTable("geolocation", {
  geolocation_zip_code_prefix: text(),
  geolocation_lat: numeric({ mode: "number" }),
  geolocation_lng: numeric({ mode: "number" }),
  geolocation_city: text(),
  geolocation_state: text(),
});

export const order = pgTable("order_table", {
  id: text().primaryKey(),
  customer_id: text()
    .notNull()
    .references(() => customer.id, { onDelete: "cascade" }),
  order_status: text().notNull(),
  order_purchase_timestamp: timestamp(),
  order_approved_at: timestamp(),
  order_delivered_carrier_date: timestamp(),
  order_delivered_customer_date: timestamp(),
  order_estimated_delivery_date: timestamp(),
});

export const product = pgTable("product", {
  id: text().primaryKey(),
  product_category_name: text(),
  product_name_length: numeric({ mode: "number" }),
  product_description_length: numeric({ mode: "number" }),
  product_photos_qty: numeric({ mode: "number" }),
  product_weight_g: numeric({ mode: "number" }),
  product_length_cm: numeric({ mode: "number" }),
  product_height_cm: numeric({ mode: "number" }),
  product_width_cm: numeric({ mode: "number" }),
});

export const seller = pgTable("seller", {
  id: text().primaryKey(),
  seller_zip_code_prefix: text(),
  seller_city: text(),
  seller_state: text(),
});

export const orderItem = pgTable("order_item", {
  id: numeric({ mode: "number" }),
  order_id: text().references(() => order.id, { onDelete: "cascade" }),
  product_id: text().references(() => product.id, { onDelete: "cascade" }),
  seller_id: text().references(() => seller.id, { onDelete: "cascade" }),
  shipping_limit_date: timestamp(),
  price: numeric({ mode: "number" }),
  freight_value: numeric({ mode: "number" }),
});

export const orderPayment = pgTable("order_payment", {
  id: text(),
  order_id: text()
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  payment_sequential: numeric({ mode: "number" }),
  payment_type: text().notNull(),
  payment_installments: numeric({ mode: "number" }),
  payment_value: numeric({ mode: "number" }),
});

export const orderReview = pgTable("order_review", {
  review_id: text(),
  order_id: text()
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  review_score: numeric({ mode: "number" }),
  review_comment_title: text(),
  review_comment_message: text(),
  review_creation_date: timestamp(),
  review_answer_timestamp: timestamp(),
});

export const productCategoryNameTranslation = pgTable(
  "product_category_name_translation",
  {
    product_category_name: text().primaryKey(),
    product_category_name_english: text().notNull(),
  }
);
