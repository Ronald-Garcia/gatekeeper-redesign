import { cn } from "@/lib/utils";
import { useState } from "react";

interface ToggleableItemProps {
  title: string;
  subtitle: string;
  details: { label: string; value: string | number; dataCy?: string }[];
  actions?: React.ReactNode;
  onClick?: () => void;
  dataCy?: string;
}

export default function ToggleableItem({ 
  title, 
 subtitle, 
  details, 
  actions,
  dataCy
}: ToggleableItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      data-cy={dataCy}
      className="relative flex flex-col rounded-lg hover:bg-stone-100 transition-all border border-stone-200 hover:border-stone-400 shadow-sm"
    >
      <div 
        className="flex items-center gap-6 p-4 cursor-pointer"
        onClick={handleToggle}
      >
        <div className="flex-1">
          <h3 className="font-medium text-base">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>
      <div 
        className={cn(
          "transition-all duration-200 ease-in-out overflow-hidden",
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-4 border-t border-stone-200 space-y-2">
        {details.map((detail, index) => (
          <p key={index} className="text-sm" data-cy={detail.dataCy}>
            <span className="font-medium">{detail.label}:</span> {detail.value}
          </p>
        ))}
        </div>
      </div>
    </div>
  );
} 