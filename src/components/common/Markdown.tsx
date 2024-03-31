import { memo } from 'react'
import ReactMarkdown, { Options } from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

import clsx from 'clsx'
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

function Markdown({ children, className = '', ...props }: Options) {
  return (
    <ReactMarkdown
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          return match ? (
            <SyntaxHighlighter
              style={a11yDark}
              language={match?.[1] ?? ''}
              PreTag="div"
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          )
        },
      }}
      remarkPlugins={[remarkGfm]}
      className={clsx('markdown prose dark:prose-invert', className)}
      {...props}
    >
      {children}
    </ReactMarkdown>
  )
}

export default memo(Markdown)
