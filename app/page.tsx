/**
 * v0 by Vercel.
 * @see https://v0.dev/t/DUwISvACEWo
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Component() {
  return (
    <div className="flex h-[90vh] flex-col rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <header className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt="Chatbot" />
            <AvatarFallback>CB</AvatarFallback>
          </Avatar>
          <h3 className="text-sm font-medium">Chatbot</h3>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" alt="You" />
              <AvatarFallback>YU</AvatarFallback>
            </Avatar>
            <div className="rounded-lg border border-gray-200 bg-gray-100 p-3 text-sm dark:border-gray-800 dark:bg-gray-800">
              <p>Hello, how can I assist you today?</p>
            </div>
          </div>
          <div className="flex items-start gap-3 justify-end">
            <div className="rounded-lg border border-gray-200 bg-gray-100 p-3 text-sm dark:border-gray-800 dark:bg-gray-800">
              <p>
                I&apos;m doing great, thanks for asking! How can I help you?
              </p>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" alt="You" />
              <AvatarFallback>YU</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" alt="Chatbot" />
              <AvatarFallback>CB</AvatarFallback>
            </Avatar>
            <div className="rounded-lg border border-gray-200 bg-gray-100 p-3 text-sm dark:border-gray-800 dark:bg-gray-800">
              <p>
                I&apos;d be happy to assist you with anything you need. What can
                I help you with?
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Input placeholder="Type your message..." className="flex-1" />
          <Button>Send</Button>
        </div>
      </div>
    </div>
  );
}
