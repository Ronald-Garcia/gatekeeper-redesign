import useMutationMachines from "@/hooks/use-mutation-machines";
import useQueryMachines from "@/hooks/use-query-machines";
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
import { Machine } from "@/data/types/machine";

//prop for handling state of the dialog
type ActivateMachineDialogProp = {
  machine: Machine;
  setShowActivateMachine: React.Dispatch<React.SetStateAction<boolean>>;
};

//function that handles state of the dialog
const ActivateMachineDialog = ({
  machine,
  setShowActivateMachine,
}: ActivateMachineDialogProp) => {
  const { enableMachine } = useMutationMachines();
  const { loadMachines } = useQueryMachines(false);

  //async function that handles activation logic
  const handleActivateMachine = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await enableMachine(machine.id);
    loadMachines();
    setShowActivateMachine(false); //make the dialog disappear
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActivateMachine(false);
  };

  // Handle dialog close event
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowActivateMachine(false);
    }
  };

  return (
    <div data-cy="machine-activate-dialog">
      <AlertDialog open={true} onOpenChange={handleDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will activate the machine.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel data-cy="machine-activate-cancel" onClick={handleCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction data-cy="machine-activate-confirm" onClick={handleActivateMachine}>
              Activate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ActivateMachineDialog;
