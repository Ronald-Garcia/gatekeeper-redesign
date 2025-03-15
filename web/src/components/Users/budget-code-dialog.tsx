import { useEffect, useState } from "react";
import useMutationUsers from "@/hooks/user-mutation-hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { useStore } from "@nanostores/react";
import { $codes, $selected_budget_codes, setSelectedBudgetCode, toggleSelectedBudgetCode } from "@/data/store";
import useQueryBudgetCodes from "@/hooks/use-query-budgetCodes";
import { BudgetCode } from "@/data/types/budgetCode";

//prop for handling state of the dialogue
type EditBudgetCodeDialogProp = {
    userId: number;
    setShowEditBudgetCode: React.Dispatch<React.SetStateAction<boolean>>;
};

// function that handles state of the dialogue, error handling from api
const EditBudgetCodeDialog = ({ userId, setShowEditBudgetCode }: EditBudgetCodeDialogProp) => {
    //ADD WHEN ROUTES FIXED
    const selectedBudgetCodes = useStore($selected_budget_codes);
    const [userBudgetCodes, setUserBudgetCodes] = useState<BudgetCode[]>([]); 

    const { getBudgetsOfUser } = useQueryBudgetCodes(false);


    const { giveBudgetCode } = useMutationUsers();
    const codesList = useStore($codes);
  
    //async function with editing logic, including error handling
    const handleEditBudgetCode = async () => {

      //ADD WHEN ROUTES FIXED
      selectedBudgetCodes.forEach(async bc => await giveBudgetCode(userId, bc.id));

      //use hooks to handle state of budget code
      setShowEditBudgetCode(false); //make the dialogue disappear
    };
  
    useQueryBudgetCodes(true);
  
    useEffect(() => {
      getBudgetsOfUser(userId, setUserBudgetCodes).then(_ => {
        setSelectedBudgetCode(userBudgetCodes);
      });
    }, []);

    return (
        <Dialog open={true} onOpenChange={setShowEditBudgetCode}>
          <DialogOverlay />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Budget Code</DialogTitle>
            </DialogHeader>
            <Label htmlFor="content" className="text-sm">
              Please select the title of your budget code
            </Label>
            <div className="space-y-4">
                <ScrollArea>
            {codesList.map((type) => {             
              return (
                <div key={type.id} onClick={() => {
                  toggleSelectedBudgetCode(type)
                 }}
                className={`flex flex-col justify-between items-center py-4 max-h-[15vh] text-sm text-clip transition-colors border-y-2 border-solid border-stone-300 hover:bg-stone-100 hover:border-stone-500 cursor-pointer ${
                  userBudgetCodes.some(bc => bc.id === type.id) ? "bg-blue-300 border-blue-600" : ""
                }`}
            >
                <p>{type.name}</p>
                </div>
              )
        })}
            </ScrollArea>  
            </div>
            <DialogFooter>
              <Button onClick={() => setShowEditBudgetCode(false)}>Cancel</Button>
              <Button onClick={handleEditBudgetCode}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

export default EditBudgetCodeDialog;