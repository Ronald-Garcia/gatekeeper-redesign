import { getFinancialStatements } from "@/data/api";
import {
  $statements, 
  setFinancialStatements,
 } from "@/data/store";
import {  } from "@/data/types/budgetCode";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { toast } from "sonner";

function useQueryStatements(reload: boolean) {
  const statements = useStore($statements);

  const loadFinancialStatements = async () => {
    try {
      const {
        data: fetchedFinancialStatements
      } = await getFinancialStatements();
      setFinancialStatements(fetchedFinancialStatements);
    }  catch (e) {
        //get message from api response, put it on a toast
        const errorMessage = (e as Error).message;
        toast.error("Sorry! There was an error fetching Budget Codes  🙁", {
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
