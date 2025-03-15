import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import useMutationMachines from "@/hooks/use-mutation-machines";
import { DialogTrigger } from "@radix-ui/react-dialog";

 
/*
AddMachineTypeDialog: Dialog that prompts user to create a new machientype 
@param setShowAddMachineType: function that controls the state of a flag, that is switched off after user is done interacting with the form. 
*/
const AddMachineTypeDialog = () => {
  const { addMachineType } = useMutationMachines();
  const [name, setName] = useState("");

  const [open, setOpen] = useState(false);

  const handleOpenClose = () => {
    setOpen(!open);    
  }

  //async function with editing logic, including error handling
  // set open here incase we want to not close for error handle in future.
  const handleAddMachineType = async () => {
    await addMachineType(name); //use hooks to handle state of machine type
    setOpen(false)
  };

   const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    }
  
    // jsx elements 
  return (
    <Dialog open={open} onOpenChange={handleOpenClose}>
      <DialogTrigger asChild>
          <Button className="jhu-blue-button add-button h-[40px]" variant={"ghost"} size="default">
              Add Machine
          </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Machine Type</DialogTitle>
        </DialogHeader>
        <Label htmlFor="content" className="text-sm">
          Please fill out form with new Machine Type: 
        </Label>
        <div className="space-y-4">
        <Input
          onChange={handleOnChangeName}
          placeholder="Enter Machine Type"
        >
        </Input>
        
        </div>
       
        <DialogFooter>
          <DialogClose asChild>
              <Button type="button" variant="ghost">
                  Close
              </Button>
            </DialogClose>
          <Button className = "jhu-blue-button" variant="ghost" onClick={handleAddMachineType}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMachineTypeDialog;
