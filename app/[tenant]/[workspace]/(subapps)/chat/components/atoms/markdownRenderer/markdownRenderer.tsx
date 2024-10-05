'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {Components} from 'react-markdown';

const components: Components = {
  p: ({children}) => <p className="whitespace-pre-wrap">{children}</p>,
  h1: ({children}) => <h1 className="text-2xl font-bold">{children}</h1>,
  h2: ({children}) => <h2 className="text-xl font-bold">{children}</h2>,
  h3: ({children}) => <h3 className="text-lg font-bold">{children}</h3>,
  ul: ({children}) => <ul className="list-disc pl-5">{children}</ul>,
  ol: ({children}) => <ol className="list-decimal pl-5">{children}</ol>,
  li: ({children}) => <li className="">{children}</li>,
  strong: ({children}) => <strong className="font-bold">{children}</strong>,
  em: ({children}) => <em className="italic">{children}</em>,
  code: ({inline, className, children}) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline ? (
      <pre className="bg-gray-100 rounded p-2">
        <code className={className}>{children}</code>
      </pre>
    ) : (
      <code className="bg-gray-100 rounded px-1">{children}</code>
    );
  },
  a: ({href, children}) => (
    <a href={href} className="text-blue-600 hover:underline">
      {children}
    </a>
  ),
};

export const MarkdownRenderer = ({content}: {content: string}) => {
  return (
    <ReactMarkdown
      components={components}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      className="markdown-content">
      {content}
    </ReactMarkdown>
  );
};
