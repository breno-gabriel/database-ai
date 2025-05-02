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
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={{
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        code: ({ className, children }) => (
          <pre>
            <code className={className}>{children}</code>
          </pre>
        ),
        h1: ({ children, ...props }) => (
          <h1 className="font-bold text-6xl" {...props}>
            {children}
          </h1>
        ),
        ul: ({ children, ...props }) => (
          <ul
            style={{
              display: "block",
              listStyleType: "disc",
              paddingInlineStart: "40px",
            }}
            {...props}
          >
            {children}
          </ul>
        ),
        ol: ({ children, ...props }) => (
          <ol
            style={{
              display: "block",
              listStyleType: "decimal",
              paddingInlineStart: "40px",
            }}
            {...props}
          >
            {children}
          </ol>
        ),
        table: ({ children }) => (
          <div className="border bg-white">
            <Table>{children}</Table>
          </div>
        ),
        thead: ({ children }) => (
          <TableHeader className="bg-muted-foreground">{children}</TableHeader>
        ),
        tbody: ({ children }) => <TableBody>{children}</TableBody>,
        tr: ({ children }) => <TableRow>{children}</TableRow>,
        th: ({ children }) => <TableHead>{children}</TableHead>,
        td: ({ children }) => (
          <TableCell className="tex-center">{children}</TableCell>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
