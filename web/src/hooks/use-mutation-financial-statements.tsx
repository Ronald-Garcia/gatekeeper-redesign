import { createFinancialStatements } from "@/data/api";
import { $currentBudget, $currentMachine, $currentUser } from "@/data/store";
import { useStore } from "@nanostores/react";
import { toast } from "sonner";


const useMutationStatements = () => {

    const curBudget = useStore($currentBudget);
    const currentUser = useStore($currentUser);
    const currentMachine = useStore($currentMachine);

    const createStatement = async (timeSpent: number) => {
        try {
            await createFinancialStatements(currentUser.id, currentMachine.id, curBudget.id, timeSpent);
            


        } catch (e) {
            const errorMessage = (e as Error).message;
            toast.error("Sorry! There was an error creating the financial statement  🙁", {
                description: errorMessage  
            });
        }
    }


    return { curBudget, createStatement };
}

export default useMutationStatements;