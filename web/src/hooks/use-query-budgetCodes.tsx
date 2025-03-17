import { getAllBudgets, getAllBudgetsOfUser } from "@/data/api";
import { $codes, 
  setBudgetCodes,
  setCurBudgets,
 } from "@/data/store";
import { BudgetCode } from "@/data/types/budgetCode";
import { SortBudgetType } from "@/data/types/sort";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { toast } from "sonner";

function useQueryBudgets(reload: boolean) {
  const codes = useStore($codes);

  const loadBudgets = async (
  sort: SortBudgetType = "name_asc",
  page: number = 1,
  limit: number = 10,
  search: string = ""
  ) => {
    try {
      const {
        data: fetchedBudgetCodes
      } = await getAllBudgets(sort, page, limit, search);
      setBudgetCodes(fetchedBudgetCodes);
    }  catch (e) {
        //get message from api response, put it on a toast
        const errorMessage = (e as Error).message;
        toast.error("Sorry! There was an error fetching Budget Codes  🙁", {
          description: errorMessage  
        });
      }
    };

    const getBudgetsOfUser = async (userId: number)
    :Promise<BudgetCode[] | undefined> => {
      try {
        const {
          data: budgets
        } = await getAllBudgetsOfUser(userId);
        setCurBudgets(budgets);
        return budgets;
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
