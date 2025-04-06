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
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { User } from "@/data/types/user";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";


//prop for handling state of the dialog
type ActivateUserDialogProp = {
  user: User;
  setShowActivateUser:  React.Dispatch<React.SetStateAction<boolean>>;
};

//function that handles state of the dialog
const ActivateUserDialog = ({
  user,
  setShowActivateUser,
}: ActivateUserDialogProp) => {
  const { modifyUser } = useMutationUsers();
  const { loadUsers } = useQueryUsers(false);

  const [isFaculty, setIsFaculty] = useState<boolean>(!user.graduationYear);
  const [graduationYear, setGraduationYear] = useState<number>(user.graduationYear || 0);
  const [gradYearError, setGradYearError] = useState(false);


  //async function that handles deletion logic
  const handleActivateUser = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isFaculty && (!graduationYear || graduationYear <  new Date().getFullYear())) {
      console.log("BILL");
      setGradYearError(true);
      return
    }

    await modifyUser(user.id, 1, isFaculty ? undefined : graduationYear);
     loadUsers();
    setShowActivateUser(false); //make the dialog disappear
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActivateUser(false);
    setGradYearError(false);
  };

  // Handle dialog close event
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowActivateUser(false);
      setGradYearError(false);
    }
  };

  const handleGraduationYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGraduationYear(parseInt(e.target.value));
    setGradYearError(false);
  };

  return (
    <div data-cy = "user-activate-dialog">
    <AlertDialog open={true} onOpenChange={handleDialogClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will activate the user account. 
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-2">

          <Label>
            Faculty?
          </Label>
          <Checkbox defaultChecked={!user.graduationYear} onCheckedChange={() => setIsFaculty(!isFaculty)} />
          
          <Label>
            Graduation Year
          </Label>
          {gradYearError && <div className="error-text">Graduation year must be current or future year</div>}
          <Input
          className={gradYearError ? "border-red-500" : ""} 
          disabled={isFaculty} type="number" value={graduationYear} defaultValue={user.graduationYear} onChange={handleGraduationYearChange} />

        </div>

        <AlertDialogFooter>
          <AlertDialogCancel data-cy = "user-activate-cancel" onClick={handleCancel}>Cancel</AlertDialogCancel>
          <Button data-cy = "user-activate-confirm" onClick={handleActivateUser}>
            Activate
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
  );
};

export default ActivateUserDialog;
