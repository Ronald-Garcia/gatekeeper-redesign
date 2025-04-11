import { getAllBudgets, getAllBudgetsOfUser, getBudgetCodeType } from "@/data/api";
import { $codes, 
  setBudgetCodes,
  setCurBudgets,
  appendBudgetCodes,
  setMetaData,
  setBudgetCodeTypes,
  appendBudgetCodeType,
  $activeTab
} from "@/data/store";
import { BudgetCode } from "@/data/types/budgetCode";
import { SortBudgetType, SortType } from "@/data/types/sort";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

function useQueryBudgets(reload: boolean) {
  const codes = useStore($codes);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const activeTab = useStore($activeTab)


  const [BudgetCodeTypeCurrentPage, setBudgetCodeTypeCurrentPage] = useState(1);
  const [BudgetCodeTypeHasMore, setBudgetCodeTypeHasMore] = useState(false);
  const [BudgetCodeTypeIsLoading, setBudgetCodeTypeIsLoading] = useState(false);


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
      } = await getAllBudgets(sort, page, limit, search, activeTab);

      setMetaData(meta);
      
      if (append) {
        appendBudgetCodes(fetchedBudgetCodes);
      } else {
        setBudgetCodes(fetchedBudgetCodes);
      }
      
      setHasMore(page * limit < meta.total);
      setCurrentPage(page);
      
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error fetching Budget Codes 🙁",
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
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error fetching Budget Codes 🙁",
        description: errorMessage
      });
    }
  }


  
    const loadBudgetCodeType = async (
      sort: SortType = "asc",
      page: number = 1,
      limit: number = 10,
      search: string = "",
      append: boolean = false
    ) => {
      try {
        setBudgetCodeTypeIsLoading(true);
        const {
          data: fetchedBudgetCodeType,
          meta
        } = await getBudgetCodeType(sort, page, limit, search);
        
        if (append) {
          appendBudgetCodeType(fetchedBudgetCodeType);
        } else {
          setBudgetCodeTypes(fetchedBudgetCodeType);
        }
        
        setBudgetCodeTypeHasMore(page * limit < meta.total);
        setBudgetCodeTypeCurrentPage(page);
        
      } catch (e) {
        const errorMessage = (e as Error).message;
        toast({
          variant: "destructive",
          title: "❌ Sorry! There was an error fetching Machine Types 🙁",
          description: errorMessage
        });
      } finally {
        setBudgetCodeTypeIsLoading(false);
      }
    };

    

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
    isLoading,
    BudgetCodeTypeCurrentPage,
    BudgetCodeTypeHasMore,
    BudgetCodeTypeIsLoading, 
    loadBudgetCodeType
  };
}

export default useQueryBudgets;
