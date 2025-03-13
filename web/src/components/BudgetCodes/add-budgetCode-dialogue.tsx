import useMutationBudgetCodes from "@/hooks/use-budgetCodes-mutation-hook";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { BudgetCode } from "@/data/types/budgetCode";
import useQueryBudgets from "@/hooks/use-query-budgetCodes";
import { DialogClose } from "@radix-ui/react-dialog";
 
// function that handles state of the dialogue, error handling from api
const AddBudgetCodeDialog = () => {
  const { addNewBudgetCode } = useMutationBudgetCodes();
  const { loadBudgets } = useQueryBudgets(false);
  const [budgetCode, setbudgetCode] = useState("");
  const [name, setName] = useState("");

  // This is dialog component state management
  const [open, setOpen] = useState(false);
  const handleOpenClose = () => {
    setOpen(!open);    
  }

  //async function with editing logic, including error handling
  // set open here incase we want to not close for error handle in future.
  const handleAddBudgetCode = async () => {
    const newCode: BudgetCode = {
      code: budgetCode,
      id: -1,
      name: name
    }
    setOpen(false);

    addNewBudgetCode(newCode);
    loadBudgets();
  };

  
  const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }

  const handleOnChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setbudgetCode(e.target.value);
  }


  return (
    <div data-cy = "budget-code-add-dialog" >
    <Dialog open={open} onOpenChange={handleOpenClose}>
      <DialogTrigger asChild>
          <Button className="jhu-blue-button add-button h-[40px]" variant={"ghost"} size="default">
              Add Budget Code
          </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New BudgetCode</DialogTitle>
        </DialogHeader>
        <Label htmlFor="content" className="text-sm">
          Please fill out with the new budget code information: 
        </Label>
        <div className="space-y-4">
        <Input
          onChange={handleOnChangeName}
          placeholder="Enter Name"
        >
        </Input>
        </div>
        <div className="space-y-4">
        <Input
          onChange={handleOnChangeCode}
          placeholder="Enter Budget Code"
        >
        </Input>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className = "jhu-white-button" variant={"ghost"} data-cy = "budget-code-add-cancel" >Cancel</Button>
          </DialogClose>
            <Button className = "jhu-blue-button" variant={"ghost"} data-cy = "budget-code-add-confirm" onClick={handleAddBudgetCode}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
    </div>
  );
};

export default AddBudgetCodeDialog;
