import { getAllBudgets, getAllBudgetsOfUser } from "@/data/api";
import { $codes, 
  setBudgetCodes,
  setCurBudgets,
  appendBudgetCodes,
} from "@/data/store";
import { BudgetCode } from "@/data/types/budgetCode";
import { SortBudgetType } from "@/data/types/sort";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function useQueryBudgets(reload: boolean) {
  const codes = useStore($codes);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadBudgets = async (
    sort: SortBudgetType = "name_asc",
    page: number = 1,
    limit: number = 10,
    search: string = "",
    append: boolean = false
  ) => {
    try {
      setIsLoading(true);
      const {
        data: fetchedBudgetCodes,
        meta
      } = await getAllBudgets(sort, page, limit, search);
      
      if (append) {
        appendBudgetCodes(fetchedBudgetCodes);
      } else {
        setBudgetCodes(fetchedBudgetCodes);
      }
      
      setHasMore(page * limit < meta.total);
      setCurrentPage(page);
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast.error("Sorry! There was an error fetching Budget Codes  🙁", {
        description: errorMessage  
      });
    } finally {
      setIsLoading(false);
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

  return { 
    codes, 
    loadBudgets, 
    getBudgetsOfUser,
    currentPage,
    hasMore,
    isLoading
  };
}

export default useQueryBudgets;
