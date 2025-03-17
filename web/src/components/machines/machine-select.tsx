import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { redirectPage } from "@nanostores/router";
import { $router } from "@/data/router";
import useMutationMachines from "@/hooks/use-mutation-machines";
import { validCurrentMachine } from "@/data/store";
import { Machine } from "@/data/types/machine";


type MachineSelectDialogProps = {
    machine: Machine;
}

const MachineSelectDialog = ({ machine }: MachineSelectDialogProps) => {

    const { saveMachine } = useMutationMachines();

    const handleOk = () => {
        saveMachine(machine).then(() => {
            if (validCurrentMachine()) {
                redirectPage($router, "interlock");
            }
        })
    }


    
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost">
                    Select!
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    Are you sure you this is {machine.name}? 
                </AlertDialogTitle>
                <AlertDialogDescription>
                    This action can be undone only by an admin.
                </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
            <AlertDialogCancel>
                No wait...
            </AlertDialogCancel>
            <AlertDialogAction
                onClick={handleOk}>
                Yes
            </AlertDialogAction>

            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

}

export default MachineSelectDialog;