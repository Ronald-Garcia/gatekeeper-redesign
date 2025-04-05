import { createBudgetCode, 
    deleteBudgetCode } from "../data/api";
import { addBudgetCode, deleteBudgetCodeById } from "../data/store";
import { BudgetCode } from "@/data/types/budgetCode";
import { useToast } from "./use-toast";

function useMutationBudgetCodes() {
  const { toast } = useToast();

  const addNewBudgetCode = async (budget: BudgetCode) => {
    try {
      const { data } = await createBudgetCode(budget);
      addBudgetCode(data);
      toast({
        variant: "default",
        title: "✅ Success 😊!",
        description: "Budget code added successfully!"
      });
      return data;
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error adding a budget code 🙁",
        description: errorMessage
      });
    }
  };

  const removeBudgetCode = async (codeId: number) => {
    try {
      await deleteBudgetCode(codeId);
      deleteBudgetCodeById(codeId);
      toast({
        variant: "default",
        title: "✅ Success 😊!",
        description: "Budget code removed successfully!"
      });
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error removing the budget code 🙁",
        description: errorMessage
      });
    }
  };
/*
  
  const updateBudgetCode = async (budget: BudgetCode) => {
    try {
      const { data } = await editBudgetCode(budget);
      updateABudgetCode(data);
      toast({
        variant: "default",
        title: "✅ Success 😊!",
        description: "Budget code updated successfully!"
      });
      return data;
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error updating the budget code 🙁",
        description: errorMessage
      });
    }
  };*/

  return {
    addNewBudgetCode,
    removeBudgetCode,
   // updateBudgetCode,
  };
}

export default useMutationBudgetCodes;
