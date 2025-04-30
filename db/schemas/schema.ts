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
  sender: text("sender").notNull(), // 'user' or 'chatbot'
  sendAt: timestamp("send_at").notNull(),
});

export const customer = pgTable("customer", {
  id: text("id").primaryKey(),
  customerUniqueId: text("customer_unique_id").notNull(),
  customerZipCodePrefix: text("customer_zip_code_prefix").notNull(),
  customerCity: text("customer_city").notNull(),
  customerState: text("customer_state").notNull(),
});

export const geolocation = pgTable("geolocation", {
  geolocationZipCodePrefix: text("geolocation_zip_code_prefix"),
  geolocationLat: numeric("geolocation_lat"),
  geolocationLng: numeric("geolocation_lng"),
  geolocationCity: text("geolocation_city"),
  geolocationState: text("geolocation_state"),
});

export const orderItem = pgTable("order_item", {
  id: numeric("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => product.id, {
      onDelete: "cascade",
    }),
  sellerId: text("seller_id")
    .notNull()
    .references(() => seller.id, {
      onDelete: "cascade",
    }),
  shippingLimitDate: timestamp("shipping_limit_date").notNull(),
  price: numeric("price").notNull(),
  freightValue: numeric("freight_value").notNull(),
});

export const orderPayment = pgTable("order_payments", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  paymentSequential: text("payment_sequential").notNull(),
  paymentType: text("payment_type").notNull(),
  paymentInstallments: numeric("payment_installments").notNull(),
  paymentValue: numeric("payment_value").notNull(),
});

export const orderReview = pgTable("order_review", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  reviewScore: numeric("review_score").notNull(),
  reviewCommentTitle: text("review_comment_title"),
  reviewCommentMessage: text("review_comment_message"),
  reviewCreationDate: timestamp("review_creation_date").notNull(),
  reviewAnswerTimestamp: timestamp("review_answer_timestamp"),
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
export const product = pgTable("product", {
  id: text("id").primaryKey(),
  productUniqueId: text("product_unique_id").notNull(),
  productCategoryName: text("product_category_name").notNull(),
  productNameLength: numeric("product_name_length").notNull(),
  productDescriptionLength: numeric("product_description_length").notNull(),
  productPhotosQty: numeric("product_photos_qty").notNull(),
  productWeightG: numeric("product_weight_g").notNull(),
  productLengthCm: numeric("product_length_cm").notNull(),
  productHeightCm: numeric("product_height_cm").notNull(),
  productWidthCm: numeric("product_width_cm").notNull(),
});

export const seller = pgTable("seller", {
  id: text("id").primaryKey(),
  sellerUniqueId: text("seller_unique_id").notNull(),
  sellerZipCodePrefix: text("seller_zip_code_prefix").notNull(),
  sellerCity: text("seller_city").notNull(),
  sellerState: text("seller_state").notNull(),
});

export const productCategoryNameTranslation = pgTable(
  "product_category_name_translation",
  {
    productCategoryName: text("product_category_name").primaryKey(),
    productCategoryNameEnglish: text("product_category_name_english").notNull(),
  }
);
