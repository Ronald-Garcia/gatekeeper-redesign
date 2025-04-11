import { useState } from "react";
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
import { DialogClose } from "@radix-ui/react-dialog";

// function that handles state of the dialogue, error handling from api
const AddBudgetCodeTypeDialog = () => {
  const { addNewBudgetCodeType } = useMutationBudgetCodes();
  const [name, setName] = useState("");

  // This is dialog component state management
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({
    name: false
  });

  const handleOpenClose = () => {
    setOpen(!open);
    // Reset errors when dialog closes
    setErrors({
      name: false
    });
  }

  const validateFields = () => {
    const newErrors = {
      name: name.trim() === ""
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  //async function with editing logic, including error handling
  const handleAddBudgetType = async () => {
    if (!validateFields()) {
      return;
    }

    await addNewBudgetCodeType(name);
    setOpen(false);
  };

  const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setErrors(prev => ({...prev, name: false}));
  }

  return (
    <div data-cy="budget-type-add-dialog">
      <Dialog open={open} onOpenChange={handleOpenClose}>
        <DialogTrigger asChild>
          <Button className="jhu-blue-button add-button h-[40px]" variant={"ghost"} size="default">
            Add Budget Type
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Budget Code Type</DialogTitle>
          </DialogHeader>
          <Label htmlFor="content" className="text-sm">
            Please fill out with the new Budget type information:
          </Label>
          <div className="space-y-4">
            <Input
              onChange={handleOnChangeName}
              placeholder="Enter Budget Type Name"
              data-cy="enter-budget-type-name"
              className={errors.name ? "border-red-500" : ""}
            >
            </Input>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="jhu-white-button" variant={"ghost"} data-cy="budget-type-add-cancel">Cancel</Button>
            </DialogClose>
            <Button className="jhu-blue-button" variant={"ghost"} data-cy="budget-type-add-confirm" onClick={handleAddBudgetType}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddBudgetCodeTypeDialog;
