import "highlight.js/styles/github.css";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableHeader,
} from "./ui/table";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800 transition"
            >
              {children}
            </a>
          ),

          h1: ({ children }) => (
            <h1 className="text-4xl font-bold my-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-semibold my-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-medium my-2">{children}</h3>
          ),

          ul: ({ children }) => (
            <ul className="list-disc pl-6 space-y-1 my-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 space-y-1 my-4">{children}</ol>
          ),

          pre: ({ children }) => (
            <pre className="bg-zinc-900 text-zinc-100 text-sm p-4 rounded-md overflow-x-auto my-4">
              {children}
            </pre>
          ),
          code: ({ className, children }) => {
            const language = className?.replace("language-", "") || "";
            return (
              <code
                className={`text-sm px-1 rounded ${
                  language ? `language-${language}` : ""
                }`}
              >
                {children}
              </code>
            );
          },

          table: ({ children }) => (
            <div className="overflow-x-auto my-4 border border-zinc-300 rounded-md">
              <Table className="w-full text-sm">{children}</Table>
            </div>
          ),
          thead: ({ children }) => (
            <TableHeader className="bg-zinc-100">{children}</TableHeader>
          ),
          tbody: ({ children }) => <TableBody>{children}</TableBody>,
          tr: ({ children }) => (
            <TableRow className="even:bg-zinc-50">{children}</TableRow>
          ),
          th: ({ children }) => (
            <TableHead className="p-2 border border-zinc-300 text-left font-semibold">
              {children}
            </TableHead>
          ),
          td: ({ children }) => (
            <TableCell className="p-2 border border-zinc-200">
              {children}
            </TableCell>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
