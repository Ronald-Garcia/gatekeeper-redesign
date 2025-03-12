import { getAllBudgets, getAllBudgetsOfUser } from "@/data/api";
import { $codes, 
  setBudgetCodes,
 } from "@/data/store";
import { BudgetCode } from "@/data/types/budgetCode";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { toast } from "sonner";

function useQueryBudgets(reload: boolean) {
  const codes = useStore($codes);

  const loadBudgets = async () => {
    try {
      const {
        data: fetchedBudgetCodes
      } = await getAllBudgets();
      setBudgetCodes(fetchedBudgetCodes);
    }  catch (e) {
        //get message from api response, put it on a toast
        const errorMessage = (e as Error).message;
        toast.error("Sorry! There was an error fetching Budget Codes  🙁", {
          description: errorMessage  
        });
      }
    };

    const getBudgetsOfUser = async (userId: number, setBudgets: React.Dispatch<React.SetStateAction<BudgetCode[]>>) => {
      try {
        const {
          data: budgets
        } = await getAllBudgetsOfUser(userId);

        setBudgets(budgets);
        
      } catch (e) {
        const errorMessage = (e as Error).message;
        toast.error("Sorry! There was an error fetching Budget Codes  🙁", {
          description: errorMessage  
        });
      }
    }

  useEffect(() => {

    if (reload) {
      loadBudgets();
    }
  }, []);

  return { codes, loadBudgets, getBudgetsOfUser };
}

export default useQueryBudgets;
