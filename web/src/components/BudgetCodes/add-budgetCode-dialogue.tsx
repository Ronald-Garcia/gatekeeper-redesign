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
  const [errors, setErrors] = useState({
    name: false,
    code: false
  });

  const handleOpenClose = () => {
    setOpen(!open);
    // Reset errors when dialog closes
    setErrors({
      name: false,
      code: false
    });
  }

  const validateFields = () => {
    const newErrors = {
      name: name.trim() === "",
      code: budgetCode.trim() === ""
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  //async function with editing logic, including error handling
  const handleAddBudgetCode = async () => {
    if (!validateFields()) {
      return;
    }

    const newCode: BudgetCode = {
      code: budgetCode,
      id: -1,
      name: name
    }
    const response = await addNewBudgetCode(newCode);
    setOpen(false);
    if (response) {
      //TODO error handling.
    }
    loadBudgets();
  };

  const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setErrors(prev => ({...prev, name: false}));
  }

  const handleOnChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setbudgetCode(e.target.value);
    setErrors(prev => ({...prev, code: false}));
  }

  return (
    <div data-cy="budget-code-add-dialog">
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
              data-cy="enter-budget-name"
              className={errors.name ? "border-red-500" : ""}
            >
            </Input>
          </div>
          <div className="space-y-4">
            <Input
              onChange={handleOnChangeCode}
              placeholder="Enter Budget Code"
              data-cy="enter-budget-code"
              className={errors.code ? "border-red-500" : ""}
            >
            </Input>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="jhu-white-button" variant={"ghost"} data-cy="budget-code-add-cancel">Cancel</Button>
            </DialogClose>
            <Button className="jhu-blue-button" variant={"ghost"} data-cy="budget-code-add-confirm" onClick={handleAddBudgetCode}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddBudgetCodeDialog;
