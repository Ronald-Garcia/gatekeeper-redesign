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
import { useStore } from "@nanostores/react";
import { $date } from "@/data/store";
import useMutationUsers from "@/hooks/user-mutation-hooks";
import { useState } from "react";
import useQueryUsers from "@/hooks/use-query-users";
import { Label } from "../ui/label";


//prop for handling state of the dialog
type BanUserDialogProp = {
  userId: number;
  setShowBanUser:  React.Dispatch<React.SetStateAction<boolean>>;
};

//function that handles state of the dialog
const BanUserDialog = ({
  userId,
  setShowBanUser,
}: BanUserDialogProp) => {
  const { modifyUser } = useMutationUsers();
  const { loadUsers } = useQueryUsers(false);
  const [errors, setErrors] = useState({
    date: false
  });

  const date = useStore($date)

  const validateDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time portion for date comparison

    const newErrors = {
      date: !date || date < today
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  //async function that handles deletion logic
  const handleBanUser = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (validateDate()) {
      await modifyUser(userId, 0, undefined, date);
      setShowBanUser(false); //make the dialog disappear
      loadUsers();
    }
    e.preventDefault();
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

        <div className={`${errors.date ? "border border-red-500 rounded-md" : ""}`}>
          <Label>
            Date to Reactivate
          </Label>
          <DatePicker />
        </div>

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
