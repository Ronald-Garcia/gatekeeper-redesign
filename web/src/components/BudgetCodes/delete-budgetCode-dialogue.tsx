import useMutationBudgetCodes from "@/hooks/budgetCodes-mutation-hook";
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
type DeleteBudgetCodeDialogProp = {
  budgetcodeId: number;
  setShowDeleteBudgetCode:  React.Dispatch<React.SetStateAction<boolean>>;
};

//function that handles state of the dialog
const DeleteBudgetCodeDialog = ({
  budgetcodeId,
  setShowDeleteBudgetCode,
}: DeleteBudgetCodeDialogProp) => {
  const { removeBudgetCode } = useMutationBudgetCodes();

  //async function that handles deletion logic
  const handleDeleteBudgetCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
     await removeBudgetCode(budgetcodeId);
    setShowDeleteBudgetCode(false); //make the dialog disappear
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteBudgetCode(false);
  };

  // Handle dialog close event
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowDeleteBudgetCode(false);
    }
  };

  return (
    <AlertDialog open={true} onOpenChange={handleDialogClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the budgetcode from using the machines. 
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteBudgetCode}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBudgetCodeDialog;
