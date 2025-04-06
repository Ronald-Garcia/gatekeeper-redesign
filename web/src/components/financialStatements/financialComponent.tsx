import { financialStatement} from "@/data/types/financialStatement";
import ToggleableItem from "../Users/toggleable-item";

export default function FinancialComponent({ statement }: { statement: financialStatement }) {
  return (
    <ToggleableItem
      title={statement.user.name}
      subtitle={`${statement.dateAdded.toLocaleDateString()}`}
      details={[
        { label: "JHED", value: `${statement.user.JHED}` },
        { label: "Budget Code", value: `${statement.budgetCode.name}` },
        { label: "Machine", value: `${statement.machine.name}` },
        { label: "Time", value: `${statement.timeSpent}` },

      ]}
      dataCy={`financial-statement-${statement.user}`}
    />
  );
}