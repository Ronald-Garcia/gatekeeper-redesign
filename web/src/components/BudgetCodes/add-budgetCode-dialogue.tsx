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
import { useState, useEffect } from "react";
import { BudgetCode } from "@/data/types/budgetCode";
import useQueryBudgets from "@/hooks/use-query-budgetCodes";
import { DialogClose } from "@radix-ui/react-dialog";
import { $budgetCodeTypes, $budget_code_queue, toggleBudgetCodeQueue, clearBudgetCodeQueue } from "@/data/store";
import { useStore } from "@nanostores/react";
import { ScrollArea } from "../ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

// function that handles state of the dialogue, error handling from api
const AddBudgetCodeDialog = () => {
  const { addNewBudgetCode } = useMutationBudgetCodes();
  const { loadBudgets, loadBudgetCodeType } = useQueryBudgets(false);
  const [budgetCode, setbudgetCode] = useState("");
  const [name, setName] = useState("");
  const typeList = useStore($budgetCodeTypes);
  const budgetCodeQueue = useStore($budget_code_queue);

  // Load budget code types when component mounts
  useEffect(() => {
    loadBudgetCodeType();
  }, []);

  // This is dialog component state management
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    code: false,
    budgetCodeTypeId: false
  });

  const handleOpenClose = () => {
    setOpen(!open);
    // Reset errors when dialog closes
    setErrors({
      name: false,
      code: false, 
      budgetCodeTypeId: false
    });
    // Clear the budget code queue when dialog closes
    clearBudgetCodeQueue();
  }

  const validateFields = () => {
    const newErrors = {
      name: name.trim() === "",
      code: budgetCode.trim() === "",
      budgetCodeTypeId: budgetCodeQueue.length === 0
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  //async function with editing logic, including error handling
  const handleAddBudgetCode = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      const selectedType = typeList.find(type => type.id === budgetCodeQueue[0]);
      
      if (!selectedType) {
        setErrors(prev => ({...prev, budgetCodeTypeId: true}));
        return;
      }
      
      const newCode: BudgetCode = {
        code: budgetCode,
        id: -1,
        name: name,
        type: selectedType,
        active: 0
      }
      
      await addNewBudgetCode(newCode);
      setOpen(false);
      loadBudgets();
    } catch (error) {
    }
  };

  const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setErrors(prev => ({...prev, name: false}));
  }

  const handleOnChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setbudgetCode(e.target.value);
    setErrors(prev => ({...prev, code: false}));
  }

  const handleClickOnBudgetType = (budgetTypeId: number) => {
    toggleBudgetCodeQueue(budgetTypeId);
    setErrors(prev => ({...prev, budgetCodeTypeId: false}));
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
            <Label htmlFor="budget-type" className="text-sm">
              Select Budget Code Type:
            </Label>
            <ScrollArea className="h-[200px]">
              <ToggleGroup type="single" className="flex-col w-full">
                {typeList.map((type) => (
                  <ToggleGroupItem
                    data-cy = {type.name}
                    key={type.id}
                    value={type.id.toString()}
                    onClick={() => handleClickOnBudgetType(type.id)}
                    className={`flex items-center justify-center h-12 w-full text-sm transition-colors border-y border-solid border-stone-200 hover:bg-stone-50 hover:border-stone-300 cursor-pointer rounded-md ${
                      budgetCodeQueue.includes(type.id) ?
                      "bg-stone-100 border-stone-300" :
                      "bg-white"
                    }`}
                    data-state={budgetCodeQueue.includes(type.id) ? "on" : "off"}
                    aria-pressed={budgetCodeQueue.includes(type.id)}
                  >
                    <p className="text-center font-medium">{type.name}</p>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </ScrollArea>
            {errors.budgetCodeTypeId && (
              <p className="text-red-500 text-sm">Please select a budget code type</p>
            )}
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
