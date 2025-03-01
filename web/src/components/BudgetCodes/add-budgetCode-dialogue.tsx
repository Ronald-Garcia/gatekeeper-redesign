import useMutationBudgetCodes from "@/hooks/budgetCodes-mutation-hook";
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
import { Input } from "../ui/input";
import { useState } from "react";
import { BudgetCode } from "@/data/types/budgetCode";




//prop for handling state of the dialogue
type EditBudgetCodeDialogProp = {
  budgetcodeId: number;
  setShowAddBudgetCode: React.Dispatch<React.SetStateAction<boolean>>;
};

 
// function that handles state of the dialogue, error handling from api
const EditBudgetCodeDialog = ({ budgetcodeId, setShowAddBudgetCode }: EditBudgetCodeDialogProp) => {
  const { addNewBudgetCode } = useMutationBudgetCodes();
  const [budgetCode, setbudgetCode] = useState("");
  const [name, setName] = useState("");

  //async function with editing logic, including error handling
  const handleAddBudgetCode = async () => {
    
    const newCode = new BudgetCode(parseInt(budgetCode), -1, name)
    addNewBudgetCode(newCode);
    setShowAddBudgetCode(false);
  };

  
  const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }

  const handleOnChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setbudgetCode(e.target.value);
  }


  return (
    <Dialog open={true} onOpenChange={setShowAddBudgetCode}>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Training</DialogTitle>
        </DialogHeader>
        <Label htmlFor="content" className="text-sm">
          Please fill out with the new budget code information: 
        </Label>
        <div className="space-y-4">
        <Input
          onChange={handleOnChangeCode}
          placeholder="Enter Budget Code"
        >
        </Input>
        
        </div>
        <div className="space-y-4">
        <Input
          onChange={handleOnChangeName}
          placeholder="Enter Name"
        >
        </Input>
        
        </div>
       
      
        <DialogFooter>
          <Button onClick={() => setShowAddBudgetCode(false)}>Cancel</Button>
          <Button onClick={handleAddBudgetCode}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBudgetCodeDialog;
