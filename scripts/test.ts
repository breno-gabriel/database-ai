import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

async function main() {
  const response = await ai.models.generateContentStream({
    model: "gemini-2.0-flash",
    contents: "how to build an app with react",
  });

  for await (const chunk of response) {
    console.log(chunk.text);
  }
}

// Em CommonJS, para usar await no topo, precisa fazer isso:
(async () => {
  await main();
})();
