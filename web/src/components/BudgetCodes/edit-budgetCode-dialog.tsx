import { useState } from "react";
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



//prop for handling state of the dialogue
type EditBudgetCodeDialogProp = {
  budgetcodeId: number;
  setShowUpdateBudgetCode: React.Dispatch<React.SetStateAction<boolean>>;
};

 
// function that handles state of the dialogue, error handling from api
const EditBudgetCodeDialog = ({ budgetcodeId, setShowUpdateBudgetCode }: EditBudgetCodeDialogProp) => {
  const { addNewBudgetCode } = useMutationBudgetCodes();
  const [cardNum, setCardNum] = useState("");

  //async function with editing logic, including error handling
  const handleEditBudgetCode = async () => {

    
    await addNewBudgetCode(budgetcodeId); //use hooks to handle state of training
    setShowUpdateBudgetCode(false); //make the dialogue disappear
  };


   const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowUpdateBudgetCode(e.target.value);
    }
  
  

  return (
    <Dialog open={true} onOpenChange={setShowUpdateBudgetCode}>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Training</DialogTitle>
        </DialogHeader>
        <Label htmlFor="content" className="text-sm">
          Please fill out form with new Student Information: 
        </Label>
        <div className="space-y-4">
        <Input
          onChange={handleOnChange}
          placeholder="Enter Student Name"
        >
        </Input>
        
        </div>
       
        <div className="space-y-4">
        <Input
          onChange={handleOnChange}
          placeholder="Email"
        >
        </Input>
        
    
        </div>
       
        <div className="Swipe Card to Fill JCard ID">
        <Input
          onChange={handleOnChange}
          placeholder="Card Number"
        >
        </Input>
    
        </div>
        <div className="Swipe Card to Fill JCard ID">
        <Input
          onChange={handleOnChange}
          placeholder="Admin"
        >
        </Input>
    
        </div>

        <div className="Swipe Card to Fill JCard ID">
        <Input
          onChange={handleOnChange}
          placeholder="jhed"
        >
        </Input>
    
        </div>
        <DialogFooter>
          <Button onClick={() => setShowUpdateBudgetCode(false)}>Cancel</Button>
          <Button onClick={handleEditBudgetCode}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBudgetCodeDialog;
