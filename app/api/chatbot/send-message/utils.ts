import { db } from "@/drizzle";
import {
  Chat,
  FunctionCallingConfigMode,
  GoogleGenAI,
  Type,
} from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
export const queryDatabaseFunctionDeclaration = {
  name: "query_database",
  description: "Executes a SQL SELECT query on the application database.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description:
          "The SQL SELECT query to run. Only SELECT queries are allowed.",
      },
    },
    required: ["query"],
  },
};

function executeQuery({ query }: { query: string }) {
  console.log("Executing query:", query);
  return db.execute(query);
}

export async function decideFunction(geminiChat: Chat, content: string) {
  try {
    const systemInstruction = await getSystemInstruction();
    const response = await geminiChat.sendMessage({
      message: content,
      config: {
        systemInstruction,
        toolConfig: {
          functionCallingConfig: {
            mode: FunctionCallingConfigMode.ANY,
          },
        },

        tools: [
          {
            functionDeclarations: [queryDatabaseFunctionDeclaration],
          },
        ],
      },
    });
    console.log("response.text", response.text);
    console.log("response.prompt_feedback", response.promptFeedback);

    if (response.functionCalls && response.functionCalls.length > 0) {
      const functionCall = response.functionCalls[0]; // Assuming one function call
      console.log(`Function to call: ${functionCall.name}`);
      console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);

      return executeQuery(functionCall.args as { query: string });
    } else {
      console.log("No function call found in the response.");

      return;
    }
    return;
  } catch (error) {
    console.error("Error in decideFunction:", error);
    return;
  }
}

export async function getSystemInstruction() {
  const introduction = `You are a database expert. You are given a postgres database schema and a question. You need to answer the question using the postgres database schema. You can only use the postgres database schema to answer the question. You can only use SQL to answer the question.`;

  return introduction + "\n\n" + schema;
}

const schema = `CREATE TABLE "user" (
  id TEXT PRIMARY KEY
);

CREATE TABLE chat (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  createdAt TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP NOT NULL
);

CREATE TABLE message (
  id TEXT PRIMARY KEY,
  chatId TEXT NOT NULL REFERENCES chat(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  role TEXT NOT NULL, -- 'user' ou 'chatbot'
  sendAt TIMESTAMP NOT NULL
);

CREATE TABLE customer (
  id TEXT PRIMARY KEY,
  customerUniqueId TEXT NOT NULL,
  customerZipCodePrefix TEXT NOT NULL,
  customerCity TEXT NOT NULL,
  customerState TEXT NOT NULL
);

CREATE TABLE geolocation (
  geolocationZipCodePrefix TEXT,
  geolocationLat NUMERIC,
  geolocationLng NUMERIC,
  geolocationCity TEXT,
  geolocationState TEXT
);

CREATE TABLE orderTable (
  id TEXT PRIMARY KEY,
  customerId TEXT NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
  orderStatus TEXT NOT NULL,
  orderPurchaseTimestamp TIMESTAMP,
  orderApprovedAt TIMESTAMP,
  orderDeliveredCarrierDate TIMESTAMP,
  orderDeliveredCustomerDate TIMESTAMP,
  orderEstimatedDeliveryDate TIMESTAMP
);

CREATE TABLE product (
  id TEXT PRIMARY KEY,
  productCategoryName TEXT,
  productNameLength NUMERIC,
  productDescriptionLength NUMERIC,
  productPhotosQty NUMERIC,
  productWeightG NUMERIC,
  productLengthCm NUMERIC,
  productHeightCm NUMERIC,
  productWidthCm NUMERIC
);

CREATE TABLE seller (
  id TEXT PRIMARY KEY,
  sellerZipCodePrefix TEXT,
  sellerCity TEXT,
  sellerState TEXT
);

CREATE TABLE orderItem (
  id NUMERIC,
  orderId TEXT REFERENCES orderTable(id) ON DELETE CASCADE,
  productId TEXT REFERENCES product(id) ON DELETE CASCADE,
  sellerId TEXT REFERENCES seller(id) ON DELETE CASCADE,
  shippingLimitDate TIMESTAMP,
  price NUMERIC,
  freightValue NUMERIC
);

CREATE TABLE orderPayment (
  id TEXT,
  orderId TEXT NOT NULL REFERENCES orderTable(id) ON DELETE CASCADE,
  paymentSequential NUMERIC,
  paymentType TEXT NOT NULL,
  paymentInstallments NUMERIC,
  paymentValue NUMERIC
);

CREATE TABLE orderReview (
  reviewId TEXT,
  orderId TEXT NOT NULL REFERENCES orderTable(id) ON DELETE CASCADE,
  reviewScore NUMERIC,
  reviewCommentTitle TEXT,
  reviewCommentMessage TEXT,
  reviewCreationDate TIMESTAMP,
  reviewAnswerTimestamp TIMESTAMP
);

CREATE TABLE productCategoryNameTranslation (
  productCategoryName TEXT PRIMARY KEY,
  productCategoryNameEnglish TEXT NOT NULL
);

`;
