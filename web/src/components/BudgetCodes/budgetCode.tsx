import { BudgetCode } from "@/data/types/budgetCode";
import BudgetCodeActions from "./budgetcode-actions";
import { useState } from "react";
import { selectItem } from "@/data/store";

export default function BudgetCodeComponent({ budgetcode }: { budgetcode: BudgetCode }) {
  const [isActive, setIsActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  function selectBudgetCode() {
    if (!isActive) {
      selectItem(budgetcode);
    }
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isActive) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div
      data-cy={`budget-code-${budgetcode.code}`}
      className="relative flex flex-col transition-all border rounded-lg shadow-sm hover:bg-stone-100 border-stone-200 hover:border-stone-400"
    >
      <div 
        className="flex items-center gap-6 p-4 cursor-pointer"
        onClick={handleToggle}
      >
        <div className="flex-1">
          <h3 className="text-base font-medium">{budgetcode.name}</h3>
          <p className="text-sm text-gray-600">Code: {budgetcode.code}</p>
        </div>
        <BudgetCodeActions budgetcodeId={budgetcode.id} />
      </div>
      <div 
        className={`transition-all duration-200 ease-in-out ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 space-y-2 border-t border-stone-200">
          <p className="text-sm"><span className="font-medium">ID:</span> {budgetcode.id}</p>
        </div>
      </div>
    </div>
  );
}
