import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Props { content: string }

export default function MarkdownRenderer({ content }: Props) {
  return (
    <div className="prose prose-invert max-w-none">
    <ReactMarkdown
      components={{
        code({ inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className="bg-gray-800 px-1 rounded text-sm" {...props}>{children}</code>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  )
}
