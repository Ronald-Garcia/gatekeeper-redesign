import { BudgetCode } from "@/data/types/budgetCode";
import BudgetCodeActions from "./budgetcode-actions";




export default function BudgetCodeComponent({ budgetcode }: { budgetcode: BudgetCode }) {
  return (
    <>
      <div>
        <BudgetCodeActions budgetcodeId={budgetcode.getId()}></BudgetCodeActions>
        <p>{budgetcode.getAlias()} </p>
        <p>{budgetcode.getCode()} </p>
      </div>
    </>
  );
}
