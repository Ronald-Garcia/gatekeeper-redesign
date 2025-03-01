import { useStore } from "@nanostores/react";
import { $codes } from "@/data/store";
import BudgetCodeComponent from "./budgetCode";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { BudgetCode } from "@/data/types/budgetCode";
import useQueryBudgets from "@/hooks/use-query-budgetCodes";

export default function BudgetCodes() {
  const userList = useStore($codes);

  useQueryBudgets(true);
  return (
    <ScrollArea>

        <div className="max-h-[20vh]">
        {userList.length === 0 ? (
        <p> No machines found. Please add some!  </p>
      ) : (
        userList.map((budgetCode) => (
          <BudgetCodeComponent key={budgetCode.id} budgetcode={budgetCode} />
        ))
      )}

        </div>
    </ScrollArea>
  );
}
