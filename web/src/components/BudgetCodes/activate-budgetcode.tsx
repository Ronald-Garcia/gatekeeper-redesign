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
import { BudgetCode } from "@/data/types/budgetCode";
import useMutationBudgetCodes from "@/hooks/use-budgetCodes-mutation-hook";
import useQueryBudgets from "@/hooks/use-query-budgetCodes";

//prop for handling state of the dialog
type ActivateBudgetCodeDialogProp = {
  budgetcode: BudgetCode;
  setShowActivateBudgetCode: React.Dispatch<React.SetStateAction<boolean>>;
};

//function that handles state of the dialog
const ActivateBudgetCodeDialog = ({
  budgetcode,
  setShowActivateBudgetCode,
}: ActivateBudgetCodeDialogProp) => {
  const { modifyBudgetCode } = useMutationBudgetCodes();
  const { loadBudgets } = useQueryBudgets(false);

  //async function that handles activation logic
  const handleActivateBudgetCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await modifyBudgetCode(budgetcode.id, 1);
    loadBudgets();
    setShowActivateBudgetCode(false); //make the dialog disappear
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActivateBudgetCode(false);
  };

  // Handle dialog close event
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowActivateBudgetCode(false);
    }
  };

  return (
    <div data-cy="budget-code-activate-dialog">
      <AlertDialog open={true} onOpenChange={handleDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will activate the budget code.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel data-cy="budget-activate-cancel" onClick={handleCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction data-cy="budget-activate-confirm" onClick={handleActivateBudgetCode}>
              Activate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ActivateBudgetCodeDialog;
