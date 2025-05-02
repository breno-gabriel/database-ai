export type Message = {
  id: string;
  content: string;
  role: "user" | "model";
  sendAt: Date;
};
