import { useStore } from "@nanostores/react";
import { $statements } from "@/data/store";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import useQueryStatements from "@/hooks/use-financialStatements-hook";


export default function FinancialStatements() {
  
    useQueryStatements(true);

  const statementList = useStore($statements);


  return (
    <ScrollArea>

        <div className="max-h-[20vh]">
        {statementList.length === 0 ? (
        <p> No statements available!  </p>
      ) : (
        statementList.map((statement) => (
          <div className="relative flex flex-col justify-between items-center py-4 max-h-[15vh] text-sm text-clip hover:bg-stone-100 transition-colors border-y-2 border-solid border-stone-300 hover:border-stone-500">
            <p>{statement.id}</p>
            <p>{statement.userId}</p>
            <p>{statement.budgetCode}</p>
            <p>{statement.machineId}</p>
            <p>{statement.startTime}</p>
            <p>{statement.endTime}</p>
          </div>
        ))
      )}

        </div>
    </ScrollArea>
  );
}
