import "highlight.js/styles/github.css"; // or another highlight.js theme
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

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
        code: ({ className, children }) => {
          return (
            <pre>
              <code className={className}>{children}</code>
            </pre>
          );
        },

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
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
