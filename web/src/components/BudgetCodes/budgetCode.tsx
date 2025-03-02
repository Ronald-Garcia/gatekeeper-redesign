import { BudgetCode } from "@/data/types/budgetCode";
import BudgetCodeActions from "./budgetcode-actions";




export default function BudgetCodeComponent({ budgetcode }: { budgetcode: BudgetCode }) {
  console.log(budgetcode);
  return (
    <>
      <div>
        <BudgetCodeActions budgetcodeId={budgetcode.id}></BudgetCodeActions>
        <p>{budgetcode.name} </p>
        <p>{budgetcode.budgetCode} </p>
      </div>
    </>
  );
}
