import { useStore } from "@nanostores/react";
import { $statements } from "@/data/store";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import useQueryStatements from "@/hooks/use-financialStatements-hook";


export default function FinancialStatements() {
  
    useQueryStatements(true);

  const statementList = useStore($statements);


  return (
    <div>
    <ScrollArea>

        <div data-cy="financial-stament-components" className="max-h-[20vh]">
        {statementList.length === 0 ? (
        <p> No statements available!  </p>
      ) : (
        statementList.map((statement) => (
          <div className="relative flex flex-col justify-between items-center py-4 max-h-[15vh] text-sm text-clip hover:bg-stone-100 transition-colors border-y-2 border-solid border-stone-300 hover:border-stone-500">
            <p>{statement.user.name}</p>
            <p>{statement.user.JHED}</p>
            <p>{statement.budgetCode.name}</p>
            <p>{statement.machine.name}</p>
            <p>{statement.dateAdded.toLocaleDateString()}</p>
            <p>{statement.timeSpent}</p>
          </div>
        ))
      )}

        </div>
    </ScrollArea>
    </div>
  );
}
