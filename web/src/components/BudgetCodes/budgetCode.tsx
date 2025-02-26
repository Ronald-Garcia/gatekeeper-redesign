import { useState } from "react";
import { BudgetCode } from "@/data/types/budgetCode";
import BudgetCodeActions from "./budgetcode-actions";




export default function BudgetCodesComponent({ budgetcode }: { budgetcode: BudgetCode }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <>
      <div>
        <BudgetCodeActions isActive={setIsActive} budgetcodeId={budgetcode.getId()}></BudgetCodeActions>
        <p>{budgetcode.getAlias()} </p>
        <p>{budgetcode.getCode()} </p>
      </div>
    </>
  );
}
