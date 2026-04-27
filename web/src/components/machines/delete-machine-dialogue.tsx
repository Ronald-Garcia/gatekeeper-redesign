import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Machine } from "@/data/types/machine";
import useMutationMachines from "@/hooks/use-mutation-machines";
import useQueryMachines from "@/hooks/use-query-machines";


//prop for handling state of the dialog
type DeleteMachineDialogProp = {
  machine: Machine;
  setShowDeleteMachine:  React.Dispatch<React.SetStateAction<boolean>>;
};

//function that handles state of the dialog
const DeleteMachineDialog = ({
  machine,
  setShowDeleteMachine,
}: DeleteMachineDialogProp) => {
  const { modifyMachine } = useMutationMachines();

  const {loadMachines} = useQueryMachines(false);

  //async function that handles deletion logic
  const handleDeleteUser = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    machine.active = 0;
    await modifyMachine(machine.name, machine.machineType.id, machine.hourlyRate, machine.id, machine.active);
    setShowDeleteMachine(false); //make the dialog disappear
    loadMachines();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteMachine(false); //make the dialog disappear
  };

  // Handle dialog close event
  const handleDialogClose = (open: boolean) => {
    if (!open) {
    setShowDeleteMachine(false); //make the dialog disappear
    }
  };

  return (
    <AlertDialog open={true} onOpenChange={handleDialogClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will render the machine inactive. 
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel data-cy = "delete-machine-cancel" onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction data-cy = "delete-machine-confirm" onClick={handleDeleteUser}>
            Deactivate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteMachineDialog;
