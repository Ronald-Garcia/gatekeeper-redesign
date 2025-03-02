import useMutationMachines from "@/hooks/use-mutation-machines";
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


//prop for handling state of the dialog
type DeleteMachineTypeDialogProp = {
  typeId: number;
  setShowDeleteMachineType:  React.Dispatch<React.SetStateAction<boolean>>;
};

/*
DeleteMachineTypeDialog: Component to confirm delete operation on a machinetype
@param typeId: determine with machineType to delete
@param setShowDeleteMachineType: function that is triggered to close the dialog box. 
*/
const DeleteMachineTypeDialog = ({
  typeId,
  setShowDeleteMachineType,
}: DeleteMachineTypeDialogProp) => {
  const { deleteMachineType } = useMutationMachines();

  //async function that handles deletion logic
  const handleDeleteMachineType = async (e: React.MouseEvent) => {
    e.stopPropagation();
     await deleteMachineType(typeId);
    setShowDeleteMachineType(false); //make the dialog disappear
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteMachineType(false);
  };

  // Handle dialog close event
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowDeleteMachineType(false);
    }
  };

  return (
    <AlertDialog open={true} onOpenChange={handleDialogClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the MachineType from using the machines. 
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteMachineType}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteMachineTypeDialog;
