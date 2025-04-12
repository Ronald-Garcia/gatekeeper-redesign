import { BudgetCode } from "@/data/types/budgetCode";
import BudgetCodeActions from "./budgetcode-actions";
import ToggleableItem from "../Users/toggleable-item";

export default function BudgetCodeComponent({ budgetcode }: { budgetcode: BudgetCode }) {
  return (
    <ToggleableItem
      title={budgetcode.name}
      subtitle={"Type: "+ (budgetcode.type?.name || "Unknown")}
      details={[
        { label: "Code", value: budgetcode.code }
      ]}
      actions={
        <BudgetCodeActions 
          budgetcode={budgetcode} 
        />
      }
      dataCy={`budget-code-${budgetcode.code}`}
    />
  );
}
