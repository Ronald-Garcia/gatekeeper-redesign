import { createBudgetCode, 
    createBudgetType, 
    deleteBudgetCode } from "../data/api";
import { addBudgetCode, addNewBudgetCodeTypes, deleteBudgetCodeById } from "../data/store";
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


  /*
      Hook to add MachineType
      * @param type: name of the new type of macine to be added
      */
      const addNewBudgetCodeType = async (type:string) => {
          try {
              const {data } = await createBudgetType(type);
              addNewBudgetCodeTypes(data);
              toast({
                  variant: "default",
                  title: "✅ Success 😊!",
                  description: "Budget type added successfully!"
              });
          } catch (e) {
              const errorMessage = (e as Error).message;
              toast({
                  variant: "destructive",
                  title: "❌ Sorry! There was an error adding the Budget Type 🙁",
                  description: errorMessage
              });
          } 
      }
  

  return {
    addNewBudgetCode,
    removeBudgetCode,
   // updateBudgetCode,
   addNewBudgetCodeType
  };
}

export default useMutationBudgetCodes;
