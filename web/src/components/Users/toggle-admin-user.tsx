import useMutationUsers from "@/hooks/user-mutation-hooks";
import useQueryUsers from "@/hooks/use-query-users";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { User } from "@/data/types/user";
import { Button } from "../ui/button";


//prop for handling state of the dialog
type AdminUserDialog = {
  user: User;
  setShowToggleAdmin:  React.Dispatch<React.SetStateAction<boolean>>;
};

//function that handles state of the dialog
const ToggleAdminUserDialog = ({
  user,
  setShowToggleAdmin,
}: AdminUserDialog) => {
  const { modifyUser } = useMutationUsers();
  const { loadUsers } = useQueryUsers(false);

  //async function that handles deletion logic
  const handleActivateUser = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await modifyUser(user.id, 1, user.graduationYear, undefined, user.isAdmin === 1 ? 0 : 1);
    loadUsers();
    setShowToggleAdmin(false); //make the dialog disappear
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowToggleAdmin(false);
  };

  // Handle dialog close event
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowToggleAdmin(false);
    }
  };

  return (
    <div data-cy = "user-activate-dialog">
    <AlertDialog open={true} onOpenChange={handleDialogClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle> { user.isAdmin === 0 ? "Promote" : "Demote"} user?</AlertDialogTitle>
          <AlertDialogDescription>
            { user.isAdmin === 0 ? "This will grant the user administrative priveleges." : "This will remove the administrative privileges of the user."} 
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel data-cy = "user-activate-cancel" onClick={handleCancel}>Cancel</AlertDialogCancel>
          <Button data-cy = "user-activate-confirm" onClick={handleActivateUser}>
            { user.isAdmin === 0 ? "Promote" : "Demote"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
  );
};

export default ToggleAdminUserDialog;
