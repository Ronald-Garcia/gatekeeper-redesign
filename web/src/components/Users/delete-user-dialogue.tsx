import useMutationUsers from "@/hooks/user-mutation-hooks";
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
type DeleteUserDialogProp = {
  userId: number;
  setShowDeleteUser:  React.Dispatch<React.SetStateAction<boolean>>;
};

//function that handles state of the dialog
const DeleteUserDialog = ({
  userId,
  setShowDeleteUser,
}: DeleteUserDialogProp) => {
  const { deleteUser } = useMutationUsers();

  //async function that handles deletion logic
  const handleDeleteUser = async (e: React.MouseEvent) => {
    e.stopPropagation();
     await deleteUser(userId);
    setShowDeleteUser(false); //make the dialog disappear
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteUser(false);
  };

  // Handle dialog close event
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowDeleteUser(false);
    }
  };

  return (
    <AlertDialog open={true} onOpenChange={handleDialogClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the user from using the machines. 
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteUser}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog;
