import { db } from "@/drizzle";
import { Chat, GoogleGenAI, Type } from "@google/genai";
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
  return db.execute(query);
}

export async function decideFunction(geminiChat: Chat, content: string) {
  const response = await geminiChat.sendMessage({
    message: content,
    config: {
      tools: [
        {
          functionDeclarations: [queryDatabaseFunctionDeclaration],
        },
      ],
    },
  });
  if (response.functionCalls && response.functionCalls.length > 0) {
    const functionCall = response.functionCalls[0]; // Assuming one function call
    console.log(`Function to call: ${functionCall.name}`);
    console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
    return executeQuery(functionCall.args as { query: string });
  } else {
    console.log("No function call found in the response.");
    console.log("response.text", response.text);
    return response.text;
  }
}

export async function getSystemInstruction() {
  const databaseSchema = await db.execute(`
        SELECT 
          table_schema, 
          table_name, 
          column_name, 
          data_type, 
          is_nullable
        FROM information_schema.columns
        WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
        ORDER BY table_schema, table_name, ordinal_position;
      `);

  const introduction = `You are a database expert. You are given a database schema and a question. You need to answer the question using the database schema. You can only use the database schema to answer the question. You can only use SQL to answer the question.`;

  return introduction + "\n\n" + JSON.stringify(databaseSchema);
}
