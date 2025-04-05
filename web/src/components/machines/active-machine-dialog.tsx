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
import { updateMachine } from "@/data/api";
import useQueryMachines from "@/hooks/use-query-machines";
  
  //prop for handling state of the dialog
  type ActiveMachineDialogProp = {
    machineId: number;
    activeStatus: number;
    setShowActiveMachine: React.Dispatch<React.SetStateAction<boolean>>;
  };
  
  //function that handles state of the dialog
  const ActiveMachineDialog = ({
    machineId,
    activeStatus,
    setShowActiveMachine,
  }: ActiveMachineDialogProp) => {

    const {loadMachines} = useQueryMachines(false);
  
    //async function that handles deletion logic
    const handleActiveMachine = async (e: React.MouseEvent) => {
      e.stopPropagation();
       await updateMachine(machineId, activeStatus);
       setShowActiveMachine(false); //make the dialog disappear
       loadMachines();
    };
  
    const handleCancel = (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log(activeStatus)
      setShowActiveMachine(false); //make the dialog disappear
    };
  
    // Handle dialog close event
    const handleDialogClose = (open: boolean) => {
      if (!open) {
        setShowActiveMachine(false); //make the dialog disappear
      }
    };
  
    return (
      <AlertDialog open={true} onOpenChange={handleDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription onClick={handleActiveMachine}>
                {activeStatus == 1 ?
                "This will render the machine inactive." : "This will activate the machine"
                }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
                Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleActiveMachine}>
            {activeStatus == 1 ?
                "Deactivate" : "Activate"
                }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  
  export default ActiveMachineDialog;
  