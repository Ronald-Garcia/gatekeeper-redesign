import { toast } from "sonner";
import { createBudgetCode, 
    deleteBudgetCode,
     editBudgetCode } from "../data/api";
import { addBudgetCode, deleteBudgetCodeById, updateABudgetCode } from "../data/store";
import { BudgetCode } from "@/data/types/budgetCode";

function useMutationBudgetCodes() {

  const addNewBudgetCode = async (budget: BudgetCode) => {
    try {
      const { data } = await createBudgetCode(budget);
      addBudgetCode(data);
      return data;
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast.error("Sorry! There was an error adding a budget code 🙁", {
        description: errorMessage,
      });
    }
  };

 
  const removeBudgetCode = async (codeId: number) => {
    try {
      await deleteBudgetCode(codeId);
      deleteBudgetCodeById(codeId);
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast.error("Sorry! There was an error removing the budget code 🙁", {
        description: errorMessage,
      });
    }
  };

  
  const updateBudgetCode = async (budget: BudgetCode) => {
    try {
      const { data } = await editBudgetCode(budget);
     updateABudgetCode(data);
      return data;
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast.error("Sorry! There was an error updating the budget code 🙁", {
        description: errorMessage,
      });
    }
  };

  return {
    addNewBudgetCode,
    removeBudgetCode,
    updateBudgetCode,
  };
}

export default useMutationBudgetCodes;
