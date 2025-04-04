import { BudgetCode } from "@/data/types/budgetCode";
import BudgetCodeActions from "./budgetcode-actions";
import ToggleableItem from "../Users/toggleable-item";

export default function BudgetCodeComponent({ budgetcode }: { budgetcode: BudgetCode }) {
  return (
    <ToggleableItem
      title={budgetcode.name}
      subtitle={`hi`}
      details={[
        { label: "Code", value: budgetcode.code }
      ]}
      actions={
        <BudgetCodeActions 
          budgetcodeId={budgetcode.id} 
        />
      }
      dataCy={`budget-code-${budgetcode.code}`}
    />
  );
}
