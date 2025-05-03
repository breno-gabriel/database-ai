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
  const introduction = `You are a database expert. You are given a postgres database schema and a question. You need to answer the question using the postgres database schema. You can only use the postgres database schema to answer the question. You can only use SQL to answer the question. You like to answer with the columns as descriptive as possible.`;

  return introduction + "\n\n" + schema;
}

export const schema = `CREATE TABLE customer (
  id TEXT PRIMARY KEY,
  customer_unique_id TEXT NOT NULL,
  customer_zip_code_prefix TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_state TEXT NOT NULL
);

CREATE TABLE geolocation (
  geolocation_zip_code_prefix TEXT,
  geolocation_lat NUMERIC,
  geolocation_lng NUMERIC,
  geolocation_city TEXT,
  geolocation_state TEXT
);

CREATE TABLE order_table (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
  order_status TEXT NOT NULL,
  order_purchase_timestamp TIMESTAMP,
  order_approved_at TIMESTAMP,
  order_delivered_carrier_date TIMESTAMP,
  order_delivered_customer_date TIMESTAMP,
  order_estimated_delivery_date TIMESTAMP
);

CREATE TABLE product (
  id TEXT PRIMARY KEY,
  product_category_name TEXT,
  product_name_length NUMERIC,
  product_description_length NUMERIC,
  product_photos_qty NUMERIC,
  product_weight_g NUMERIC,
  product_length_cm NUMERIC,
  product_height_cm NUMERIC,
  product_width_cm NUMERIC
);

CREATE TABLE seller (
  id TEXT PRIMARY KEY,
  seller_zip_code_prefix TEXT,
  seller_city TEXT,
  seller_state TEXT
);

CREATE TABLE order_item (
  id NUMERIC,
  order_id TEXT REFERENCES order_table(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES product(id) ON DELETE CASCADE,
  seller_id TEXT REFERENCES seller(id) ON DELETE CASCADE,
  shipping_limit_date TIMESTAMP,
  price NUMERIC,
  freight_value NUMERIC
);

CREATE TABLE order_payment (
  id TEXT,
  order_id TEXT NOT NULL REFERENCES order_table(id) ON DELETE CASCADE,
  payment_sequential NUMERIC,
  payment_type TEXT NOT NULL,
  payment_installments NUMERIC,
  payment_value NUMERIC
);

CREATE TABLE order_review (
  review_id TEXT,
  order_id TEXT NOT NULL REFERENCES order_table(id) ON DELETE CASCADE,
  review_score NUMERIC,
  review_comment_title TEXT,
  review_comment_message TEXT,
  review_creation_date TIMESTAMP,
  review_answer_timestamp TIMESTAMP
);

CREATE TABLE product_category_name_translation (
  product_category_name TEXT PRIMARY KEY,
  product_category_name_english TEXT NOT NULL
);
`;
