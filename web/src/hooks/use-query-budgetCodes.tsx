import { getAllBudgets } from "@/data/api";
import { $codes, 
  setBudgetCodes,
 } from "@/data/store";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { toast } from "sonner";

function useQueryUsers() {
  const decks = useStore($codes);

  const loadBudgets = async () => {
    try {
      const {
        data: fetchedUsers
      } = await getAllBudgets();
      setBudgetCodes(fetchedUsers);
    }  catch (e) {
        //get message from api response, put it on a toast
        const errorMessage = (e as Error).message;
        toast.error("Sorry! There was an error fetching Budget Codes  🙁", {
          description: errorMessage  
        });
      }
    };

  useEffect(() => {
    loadBudgets();
  }, []);

  return { decks, loadBudgets };
}

export default useQueryUsers;
