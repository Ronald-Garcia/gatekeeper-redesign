import { useStore } from "@nanostores/react";
import { $codes } from "@/data/store";
import BudgetCodeComponent from "./budgetCode";
import useQueryBudgets from "@/hooks/use-query-budgetCodes";

export default function BudgetCodes() {
  useQueryBudgets(true);

  const codeList = useStore($codes);

  return (
        <div className="p-4">
          {codeList.length === 0 ? (
            <p data-cy="no-codes">No budget codes!</p>
          ) : (
            <div className="space-y-4">
              {codeList.map((budgetCode) => (
                <BudgetCodeComponent key={budgetCode.id} budgetcode={budgetCode} />
              ))}
            </div>
          )}
        </div>
  );
}
