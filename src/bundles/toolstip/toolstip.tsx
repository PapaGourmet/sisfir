// components/Tooltip.tsx
import React, { useState } from 'react';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    const [visible, setVisible] = useState(false);

    const showTooltip = () => setVisible(true);
    const hideTooltip = () => setVisible(false);

    return (
        <div className="relative inline-block">
            <div
                className="cursor-pointer"
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
            >
                {children}
            </div>
            {visible && (
                <div className="absolute top-5 mt-0 w-30 p-2 bg-gray-800 text-white rounded opacity-90 text-xs whitespace-nowrap text-center z-100">
                    {content}
                </div>
            )}
        </div>
    );
};

export default Tooltip;