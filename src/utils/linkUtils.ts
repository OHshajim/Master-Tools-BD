
export interface ParsedLink {
  text: string;
  url: string;
  startIndex: number;
  endIndex: number;
}

export interface MessagePart {
  type: 'text' | 'link';
  content: string;
  url?: string;
}

/**
 * Parse links in the format [text](url) from a message
 */
export const parseLinks = (message: string): ParsedLink[] => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links: ParsedLink[] = [];
  let match;

  while ((match = linkRegex.exec(message)) !== null) {
    links.push({
      text: match[1],
      url: match[2],
      startIndex: match.index,
      endIndex: match.index + match[0].length
    });
  }

  return links;
};

/**
 * Convert message with [text](url) format to structured data array
 */
export const parseMessageWithLinks = (message: string): MessagePart[] => {
  const links = parseLinks(message);
  
  if (links.length === 0) {
    return [{ type: 'text', content: message }];
  }

  const parts: MessagePart[] = [];
  let lastIndex = 0;

  links.forEach((link) => {
    // Add text before the link
    if (link.startIndex > lastIndex) {
      parts.push({
        type: 'text',
        content: message.substring(lastIndex, link.startIndex)
      });
    }

    // Add the link
    parts.push({
      type: 'link',
      content: link.text,
      url: link.url
    });

    lastIndex = link.endIndex;
  });

  // Add remaining text after the last link
  if (lastIndex < message.length) {
    parts.push({
      type: 'text',
      content: message.substring(lastIndex)
    });
  }

  return parts;
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Insert link at cursor position in textarea
 */
export const insertLinkAtCursor = (
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  linkText: string,
  url: string,
  currentValue: string,
  setValue: (value: string) => void
) => {
  if (!textareaRef.current) return;

  const textarea = textareaRef.current;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  
  const linkMarkdown = `[${linkText}](${url})`;
  const newValue = currentValue.substring(0, start) + linkMarkdown + currentValue.substring(end);
  
  setValue(newValue);

  // Set cursor position after the inserted link
  setTimeout(() => {
    textarea.focus();
    const newCursorPos = start + linkMarkdown.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
  }, 0);
};
