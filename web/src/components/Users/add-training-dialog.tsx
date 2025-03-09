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
import { $machine_types } from "@/data/store";
import useQueryMachines from "@/hooks/use-query-machines";



//prop for handling state of the dialogue
type EditTrainingDialogProp = {
  userId: number;
  setShowEditTraining: React.Dispatch<React.SetStateAction<boolean>>;
};

 
// function that handles state of the dialogue, error handling from api
const EditTrainingDialog = ({ userId, setShowEditTraining }: EditTrainingDialogProp) => {
  const [training, setTraining] = useState(-1);
  const { giveTraining } = useMutationUsers();
 const machineList = useStore($machine_types);

  //async function with editing logic, including error handling
  const handleEditTraining = async () => {
    console.log(training)
    await giveTraining(userId, training); //use hooks to handle state of training
    setShowEditTraining(false); //make the dialogue disappear
  };

  useQueryMachines(true);

  useEffect(() => {
    console.log(machineList);
  }, [machineList]);

  return (
    <div data-cy= "user-training-dialog">
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
    machineList.map((type) => (
     
            <div key={type.id} data-cy="machine-option" onClick={() => setTraining(type.id) }
            className={`flex flex-col justify-between items-center py-4 max-h-[15vh] text-sm text-clip transition-colors border-y-2 border-solid border-stone-300 hover:bg-stone-100 hover:border-stone-500 cursor-pointer ${
              training === type.id ? "bg-blue-300 border-blue-600" : ""
            }`}
          >
            <p>{type.type}</p>
            </div>
         ))
           }
          </ScrollArea>
    
        </div>
        <DialogFooter>
          <Button data-cy = "user-traning-cancel"  onClick={() => setShowEditTraining(false)}>Cancel</Button>
          <Button data-cy = "user-training-add"  onClick={handleEditTraining}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  );
};

export default EditTrainingDialog;
