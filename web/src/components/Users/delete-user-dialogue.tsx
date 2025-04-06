import useMutationUsers from "@/hooks/user-mutation-hooks";
import useQueryUsers from "@/hooks/use-query-users";
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
  const { modifyUser } = useMutationUsers();
  const { loadUsers } = useQueryUsers(false);

  //async function that handles deletion logic
  const handleDeleteUser = async (e: React.MouseEvent) => {
    e.stopPropagation();
     await modifyUser(userId, 0);
     loadUsers();
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
    <div data-cy = "user-delete-dialog">
    <AlertDialog open={true} onOpenChange={handleDialogClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the user from using the machines. 
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel data-cy = "user-delete-cancel" onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction data-cy = "user-delete-confirm" onClick={handleDeleteUser}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
  );
};

export default DeleteUserDialog;
