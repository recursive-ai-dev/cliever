import React from 'react';

/**
 * MarkdownText
 * Minimal, dependency-free renderer for the structured documents produced by
 * the local model service (headings, bold/italic, inline code, code fences,
 * bullet/numbered lists, pipe tables, blockquotes, horizontal rules).
 *
 * Everything is rendered as React text nodes — never innerHTML — so the
 * output is inherently XSS-safe.
 */

const INLINE_PATTERN = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\n]+\*)/g;

const renderInline = (text: string, keyPrefix: string): React.ReactNode[] => {
  const parts = text.split(INLINE_PATTERN);
  return parts.map((part, idx) => {
    const key = `${keyPrefix}-${idx}`;
    if (!part) return null;

    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={key} className="md-strong">{part.slice(2, -2)}</strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={key} className="md-code-inline">{part.slice(1, -1)}</code>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={key} className="md-em">{part.slice(1, -1)}</em>;
    }
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
};

interface Block {
  kind: 'h2' | 'h3' | 'h4' | 'p' | 'ul' | 'ol' | 'pre' | 'quote' | 'hr' | 'table';
  text?: string;
  lines?: string[];
  header?: string[];
  rows?: string[][];
}

const TABLE_SEPARATOR = /^\|?[\s:|-]+\|[\s:|-]*$/;

const splitTableRow = (line: string): string[] => {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return trimmed.split('|').map(cell => cell.trim());
};

const parseBlocks = (content: string): Block[] => {
  const lines = content.split(/\r?\n/);
  const blocks: Block[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i] ?? '';
    const trimmed = line.trim();

    // Blank line — skip
    if (!trimmed) {
      i++;
      continue;
    }

    // Code fence
    if (trimmed.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !(lines[i] ?? '').trim().startsWith('```')) {
        codeLines.push(lines[i] ?? '');
        i++;
      }
      i++; // consume closing fence (or run off the end)
      blocks.push({ kind: 'pre', text: codeLines.join('\n') });
      continue;
    }

    // Headings
    if (/^####\s+/.test(trimmed)) {
      blocks.push({ kind: 'h4', text: trimmed.replace(/^####\s+/, '') });
      i++;
      continue;
    }
    if (/^###\s+/.test(trimmed)) {
      blocks.push({ kind: 'h3', text: trimmed.replace(/^###\s+/, '') });
      i++;
      continue;
    }
    if (/^##\s+/.test(trimmed)) {
      blocks.push({ kind: 'h2', text: trimmed.replace(/^##\s+/, '') });
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      blocks.push({ kind: 'hr' });
      i++;
      continue;
    }

    // Blockquote (single or multi-line)
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && (lines[i] ?? '').trim().startsWith('>')) {
        quoteLines.push((lines[i] ?? '').trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({ kind: 'quote', text: quoteLines.join(' ') });
      continue;
    }

    // Pipe table: header row + separator row
    if (trimmed.includes('|') && i + 1 < lines.length && TABLE_SEPARATOR.test((lines[i + 1] ?? '').trim())) {
      const header = splitTableRow(trimmed);
      i += 2; // consume header + separator
      const rows: string[][] = [];
      while (i < lines.length) {
        const rowLine = (lines[i] ?? '').trim();
        if (!rowLine.includes('|') || !rowLine) break;
        rows.push(splitTableRow(rowLine));
        i++;
      }
      blocks.push({ kind: 'table', header, rows });
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test((lines[i] ?? '').trim())) {
        items.push((lines[i] ?? '').trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push({ kind: 'ul', lines: items });
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test((lines[i] ?? '').trim())) {
        items.push((lines[i] ?? '').trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push({ kind: 'ol', lines: items });
      continue;
    }

    // Paragraph (consecutive non-blank lines)
    const paraLines: string[] = [];
    while (i < lines.length) {
      const paraLine = (lines[i] ?? '').trim();
      if (!paraLine) break;
      if (
        paraLine.startsWith('##') ||
        paraLine.startsWith('```') ||
        paraLine.startsWith('>') ||
        /^[-*]\s+/.test(paraLine) ||
        /^\d+\.\s+/.test(paraLine) ||
        /^(-{3,}|\*{3,})$/.test(paraLine)
      ) {
        break;
      }
      paraLines.push(paraLine);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ kind: 'p', text: paraLines.join('\n') });
    } else {
      i++; // safety: always advance
    }
  }

  return blocks;
};

interface MarkdownTextProps {
  content: string;
  className?: string;
}

const MarkdownText: React.FC<MarkdownTextProps> = ({ content, className = '' }) => {
  const blocks = React.useMemo(() => parseBlocks(content), [content]);

  return (
    <div className={`markdown-content${className ? ` ${className}` : ''}`}>
      {blocks.map((block, idx) => {
        const key = `md-${idx}`;
        switch (block.kind) {
          case 'h2':
            return <span key={key} className="md-h2">{renderInline(block.text ?? '', key)}</span>;
          case 'h3':
            return <span key={key} className="md-h3">{renderInline(block.text ?? '', key)}</span>;
          case 'h4':
            return <span key={key} className="md-h4">{renderInline(block.text ?? '', key)}</span>;
          case 'hr':
            return <hr key={key} className="md-hr" />;
          case 'pre':
            return <pre key={key} className="md-pre">{block.text}</pre>;
          case 'quote':
            return <p key={key} className="md-quote">{renderInline(block.text ?? '', key)}</p>;
          case 'ul':
            return (
              <ul key={key} className="md-ul">
                {(block.lines ?? []).map((item, itemIdx) => (
                  <li key={`${key}-${itemIdx}`} className="md-li">{renderInline(item, `${key}-${itemIdx}`)}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={key} className="md-ol">
                {(block.lines ?? []).map((item, itemIdx) => (
                  <li key={`${key}-${itemIdx}`} className="md-li">{renderInline(item, `${key}-${itemIdx}`)}</li>
                ))}
              </ol>
            );
          case 'table': {
            const header = block.header ?? [];
            const rows = block.rows ?? [];
            return (
              <div key={key} className="md-table-wrap">
                <table className="md-table">
                  <thead>
                    <tr>
                      {header.map((cell, cellIdx) => (
                        <th key={`${key}-h-${cellIdx}`}>{renderInline(cell, `${key}-h-${cellIdx}`)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, rowIdx) => (
                      <tr key={`${key}-r-${rowIdx}`}>
                        {row.map((cell, cellIdx) => (
                          <td key={`${key}-r-${rowIdx}-${cellIdx}`}>{renderInline(cell, `${key}-r-${rowIdx}-${cellIdx}`)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          case 'p':
          default: {
            const lines = (block.text ?? '').split('\n');
            return (
              <p key={key} className="md-p">
                {lines.map((line, lineIdx) => (
                  <React.Fragment key={`${key}-l-${lineIdx}`}>
                    {lineIdx > 0 && <br />}
                    {renderInline(line, `${key}-l-${lineIdx}`)}
                  </React.Fragment>
                ))}
              </p>
            );
          }
        }
      })}
    </div>
  );
};

export default MarkdownText;
