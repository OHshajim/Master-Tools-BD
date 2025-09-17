
import React from 'react';
import { parseMessageWithLinks, MessagePart } from '@/utils/linkUtils';

interface MessageRendererProps {
  message: string;
  className?: string;
}

export const MessageRenderer: React.FC<MessageRendererProps> = ({ 
  message, 
  className = "" 
}) => {
  const parts = parseMessageWithLinks(message);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.type === 'link') {
          return (
            <a
              key={`link-${index}`}
              href={part.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              {part.content}
            </a>
          );
        }
        return <span key={`text-${index}`}>{part.content}</span>;
      })}
    </span>
  );
};
