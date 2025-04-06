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
import { DatePicker } from "../financialStatements/datepick";


//prop for handling state of the dialog
type BanUserDialogProp = {
  userId: number;
  setShowBanUser:  React.Dispatch<React.SetStateAction<boolean>>;
};

//function that handles state of the dialog
const BanUserDialog = ({
  //userId,
  setShowBanUser,
}: BanUserDialogProp) => {
//  const { banUserById } = useMutationUsers();

  //async function that handles deletion logic
  const handleBanUser = async (e: React.MouseEvent) => {
    e.stopPropagation();
   //  await banUserById(userId,1);
    setShowBanUser(false); //make the dialog disappear
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBanUser(false);
  };

  // Handle dialog close event
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowBanUser(false);
    }
  };

  return (
    <div data-cy = "user-delete-dialog">
    <AlertDialog open={true} onOpenChange={handleDialogClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will timeout the user from using the machines. 
          </AlertDialogDescription>
        </AlertDialogHeader>

        <DatePicker>
          
        </DatePicker>

        <AlertDialogFooter>
          <AlertDialogCancel data-cy = "user-ban-cancel" onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction  data-cy = "user-ban-confirm" onClick={handleBanUser}>
            Timeout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
  );
};

export default BanUserDialog;
