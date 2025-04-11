import { useStore } from "@nanostores/react";
import { $statements } from "@/data/store";
import useQueryStatements from "@/hooks/use-financialStatements-hook";
import FinancialComponent from "./financialComponent";
import { financialStatement } from "@/data/types/financialStatement";


export default function FinancialStatements() {
  
  useQueryStatements(true);

  const statementList = useStore($statements);

  return (
          <div className="max-h-[20vh] p-4">
          {statementList.length === 0 ? (
          <p> No statements found.  </p>
        ) : 
        <div className="space-y-4">
  
          {statementList.map((fs: financialStatement) => (
            <FinancialComponent key={fs.dateAdded.getMilliseconds()} statement={fs}/>
          ))}
          </div>
        }
          </div>
    );
}
