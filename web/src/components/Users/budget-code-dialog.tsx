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
    //ADD WHEN ROUTES FIXED
    const { giveBudgetCode} = useMutationUsers();
   const codesList = useStore($codes);
  
    //async function with editing logic, including error handling
    const handleEditBudgetCode = async () => {
      //ADD WHEN ROUTES FIXED
      await giveBudgetCode(userId, budgetCode); //use hooks to handle state of budget code
      setShowEditBudgetCode(false); //make the dialogue disappear
    };
  
    useQueryBudgetCodes(true);
  
    useEffect(() => {
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
            <div className="space-y-4">
                <ScrollArea>
            {
        codesList.map((type) => (
        
                <div key={type.id} onClick={() => setBudgetCode(type.id) }
                className={`flex flex-col justify-between items-center py-4 max-h-[15vh] text-sm text-clip transition-colors border-y-2 border-solid border-stone-300 hover:bg-stone-100 hover:border-stone-500 cursor-pointer ${
                budgetCode === type.id ? "bg-blue-300 border-blue-600" : ""
                }`}
            >
                <p>{type.name}</p>
                </div>
            ))
            }
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