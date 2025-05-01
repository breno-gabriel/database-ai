export type Message = {
  id: string;
  content: string;
  role: "user" | "model";
  timestamp: Date;
};
