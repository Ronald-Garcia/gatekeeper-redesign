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
          <div>{JSON.stringify(statement)}</div>
        ))
      )}

        </div>
    </ScrollArea>
  );
}
