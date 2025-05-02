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
  const result = await db.execute(`
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

  // Step 2: Group by table
  const groupedSchema: Record<
    string,
    {
      schema: string;
      table: string;
      columns: { name: string; type: string; nullable: boolean }[];
    }
  > = {};

  for (const row of result.rows) {
    const key = `${row.table_name}`;
    if (!groupedSchema[key]) {
      groupedSchema[key] = {
        schema: row.table_schema as string,
        table: row.table_name as string,
        columns: [],
      };
    }
    groupedSchema[key].columns.push({
      name: row.column_name as string,
      type: row.data_type as string,
      nullable: row.is_nullable === "YES",
    });
  }

  const introduction = `You are a database expert. You are given a database schema and a question. You need to answer the question using the database schema. You can only use the database schema to answer the question. You can only use SQL to answer the question. You need to format the query results in a table.`;

  return introduction + "\n\n" + JSON.stringify(groupedSchema);
}
