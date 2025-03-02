import { useState } from "react";
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
import useMutationMachines from "@/hooks/use-mutation-machines";



//prop for handling state of the dialogue
type AddUserDialogProp = {
  setShowAddMachineType: React.Dispatch<React.SetStateAction<boolean>>;
};

 
// function that handles state of the dialogue, error handling from api
const AddMachineTypeDialog = ({ setShowAddMachineType }: AddUserDialogProp) => {
  const { addMachineType } = useMutationMachines();
  const [name, setName] = useState("");

  //async function with editing logic, including error handling
  const handleAddMachineType = async () => {


    
    await addMachineType(name); //use hooks to handle state of training
    setShowAddMachineType(false); //make the dialogue disappear
  };


   const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    }


  

  return (
    <Dialog open={true} onOpenChange={setShowAddMachineType}>
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
          onChange={handleOnChangeName}
          placeholder="Enter MachineType"
        >
        </Input>
        
        </div>
       
        <DialogFooter>
          <Button onClick={() => setShowAddMachineType(false)}>Cancel</Button>
          <Button onClick={handleAddMachineType}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMachineTypeDialog;
