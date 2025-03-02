import { BudgetCode } from "@/data/types/budgetCode";
import BudgetCodeActions from "./budgetcode-actions";




export default function BudgetCodeComponent({ budgetcode }: { budgetcode: BudgetCode }) {

  return (
    <>
      <div className="relative flex flex-col justify-between items-center py-4 max-h-[15vh] text-sm text-clip hover:bg-stone-100 transition-colors border-y-2 border-solid border-stone-300 hover:border-stone-500">
        <BudgetCodeActions budgetcodeId={budgetcode.id}></BudgetCodeActions>
        <p>{budgetcode.name} </p>
        <p>{budgetcode.budgetCode} </p>
      </div>
    </>
  );
}
