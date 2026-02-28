import React, { useState, useMemo } from 'react';
import { sanitizeDisplayText } from '../utils/sanitization';

interface SimpleTooltipProps {
  content: string;
  children: React.ReactNode;
}

const SimpleTooltip: React.FC<SimpleTooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const safeContent = useMemo(() => sanitizeDisplayText(content), [content]);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-mono rounded shadow-xl whitespace-nowrap z-50"
             style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          {safeContent}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
               style={{ borderTopColor: 'var(--border)' }}></div>
        </div>
      )}
    </div>
  );
};

export default SimpleTooltip;