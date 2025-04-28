export type Message = {
  id: string;
  content: string;
  sender: "user" | "chatbot";
  timestamp: Date;
};
