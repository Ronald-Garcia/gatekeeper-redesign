import { useStore } from "@nanostores/react";
import { $codes } from "@/data/store";
import BudgetCodeComponent from "./budgetCode";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import useQueryBudgets from "@/hooks/use-query-budgetCodes";


export default function BudgetCodes() {
  useQueryBudgets(true);

  const codeList = useStore($codes);


  return (
    <ScrollArea>

        <div className="max-h-[20vh]">
        {codeList.length === 0 ? (
        <p data-cy = "no-codes"> No budget codes!  </p>
      ) : (
        codeList.map((budgetCode) => (
          <BudgetCodeComponent key={budgetCode.id} budgetcode={budgetCode} />
        ))
      )}

        </div>
    </ScrollArea>
  );
}
