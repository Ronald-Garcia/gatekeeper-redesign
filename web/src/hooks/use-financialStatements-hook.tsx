import { getFinancialStatements } from "@/data/api";
import {
  $date_range,
  $statements, 
  setFinancialStatements,
 } from "@/data/store";
import {  } from "@/data/types/budgetCode";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { useToast } from "./use-toast";

function useQueryStatements(reload: boolean) {
  const statements = useStore($statements);
  const dateRange = useStore($date_range);
  const { toast } = useToast();
  
  const loadFinancialStatements = async () => {
    try {
      const {
        data: fetchedFinancialStatements
      } = await getFinancialStatements(dateRange!.to as Date, dateRange!.from as Date);
      setFinancialStatements(fetchedFinancialStatements);
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error fetching financial statements 🙁",
        description: errorMessage
      });
    }
  };

  useEffect(() => {
    if (reload) {
      loadFinancialStatements();
    }
  }, []);

  return { statements, loadFinancialStatements};
}

export default useQueryStatements;
