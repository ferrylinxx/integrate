"use client";

import { ReactNode, useState } from "react";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 -mt-1 border-t-gray-900',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1 border-b-gray-900',
    left: 'left-full top-1/2 transform -translate-y-1/2 -ml-1 border-l-gray-900',
    right: 'right-full top-1/2 transform -translate-y-1/2 -mr-1 border-r-gray-900'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className={`absolute ${positionClasses[position]} z-50 animate-fadeIn`}>
          <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl min-w-[200px] max-w-[300px]">
            {content}
            {/* Flecha */}
            <div className={`absolute ${arrowClasses[position]}`}>
              <div className="border-4 border-transparent"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

