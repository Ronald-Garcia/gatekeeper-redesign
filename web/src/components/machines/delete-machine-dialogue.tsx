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
import useMutationMachines from "@/hooks/use-mutation-machines";
import useQueryMachines from "@/hooks/use-query-machines";


//prop for handling state of the dialog
type DeleteMachineDialogProp = {
  machineId: number;
  setShowDeleteMachine:  React.Dispatch<React.SetStateAction<boolean>>;
};

//function that handles state of the dialog
const DeleteMachineDialog = ({
  machineId,
  setShowDeleteMachine,
}: DeleteMachineDialogProp) => {
  const { modifyMachine } = useMutationMachines();

  const {loadMachines} = useQueryMachines(false);

  //async function that handles deletion logic
  const handleDeleteUser = async (e: React.MouseEvent) => {
    e.stopPropagation();
     await modifyMachine(machineId, 0);
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
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteUser}>
            Deactivate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteMachineDialog;
