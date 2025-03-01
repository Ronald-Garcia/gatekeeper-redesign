import { useState } from "react";
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
import { $machines } from "@/data/store";


//prop for handling state of the dialogue
type EditTrainingDialogProp = {
  userId: number;
  setShowEditTraining: React.Dispatch<React.SetStateAction<boolean>>;
};

 
// function that handles state of the dialogue, error handling from api
const EditTrainingDialog = ({ userId, setShowEditTraining }: EditTrainingDialogProp) => {
  const [training, setTraining] = useState(-1);
  const { giveTraining } = useMutationUsers();
 const machineList = useStore($machines);

  //async function with editing logic, including error handling
  const handleEditTraining = async () => {
    await giveTraining(userId, training); //use hooks to handle state of training
    setShowEditTraining(false); //make the dialogue disappear
  };


  return (
    <Dialog open={true} onOpenChange={setShowEditTraining}>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Training</DialogTitle>
        </DialogHeader>
        <Label htmlFor="content" className="text-sm">
          Please select the title of your training
        </Label>
        <div className="space-y-4">
            <ScrollArea>

        {
    machineList.map((machine) => (
            <div key={machine.id} onClick={() => setTraining(machine.id)}>
                 {machine.name}
            </div>
         ))
           }
          </ScrollArea>
    
        </div>
        <DialogFooter>
          <Button onClick={() => setShowEditTraining(false)}>Cancel</Button>
          <Button onClick={handleEditTraining}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTrainingDialog;
