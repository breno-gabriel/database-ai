import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function ChatLanding() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Bem-vindo ao Database AI</h1>
      <Button className="mt-4 text-lg">
        Criar novo Chat <PlusCircle />
      </Button>
    </div>
  );
}
