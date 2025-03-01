import { BudgetCode } from "@/data/types/budgetCode";
import BudgetCodeActions from "./budgetcode-actions";




export default function BudgetCodeComponent({ budgetcode }: { budgetcode: BudgetCode }) {
  return (
    <>
      <div>
        <BudgetCodeActions budgetcodeId={budgetcode.id}></BudgetCodeActions>
        <p>{budgetcode.alias} </p>
        <p>{budgetcode.code} </p>
      </div>
    </>
  );
}
