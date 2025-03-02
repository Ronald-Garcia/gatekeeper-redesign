import { useStore } from "@nanostores/react";
import { $codes } from "@/data/store";
import BudgetCodeComponent from "./budgetCode";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import useQueryBudgets from "@/hooks/use-query-budgetCodes";
import { useEffect } from "react";

export default function BudgetCodes() {
  useQueryBudgets(true);

  const codeList = useStore($codes);

  // useEffect(() =>  {
   
  //   loadBudgets();
  //   }, [codeList]);
    
  return (
    <ScrollArea>

        <div className="max-h-[20vh]">
        {codeList.length === 0 ? (
        <p> No machines found. Please add some!  </p>
      ) : (
        codeList.map((budgetCode) => (
          <BudgetCodeComponent key={budgetCode.id} budgetcode={budgetCode} />
        ))
      )}

        </div>
    </ScrollArea>
  );
}
