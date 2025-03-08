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
import { $codes } from "@/data/store";
import useQueryBudgetCodes from "@/hooks/use-query-budgetCodes";

//prop for handling state of the dialogue
type EditBudgetCodeDialogProp = {
    userId: number;
    setShowEditBudgetCode: React.Dispatch<React.SetStateAction<boolean>>;
};

// function that handles state of the dialogue, error handling from api
const EditBudgetCodeDialog = ({ userId, setShowEditBudgetCode }: EditBudgetCodeDialogProp) => {
    const [budgetCode, setBudgetCode] = useState(-1);
    const { giveTraining } = useMutationUsers();
   const codesList = useStore($codes);
  
    //async function with editing logic, including error handling
    const handleEditBudgetCode = async () => {
      console.log(budgetCode)
      await giveTraining(userId, budgetCode); //use hooks to handle state of training
      setShowEditBudgetCode(false); //make the dialogue disappear
    };
  
    useQueryBudgetCodes(true);
  
    useEffect(() => {
      console.log(codesList);
    }, [codesList]);

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
            
            <DialogFooter>
              <Button onClick={() => setShowEditBudgetCode(false)}>Cancel</Button>
              <Button onClick={handleEditBudgetCode}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

export default EditBudgetCodeDialog;