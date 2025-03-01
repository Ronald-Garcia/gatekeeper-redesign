import { MachineType } from "@/data/types/machineType";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";


type MachineSelectDialogProps = {
    machine: MachineType;
}

const MachineSelectDialog = ({ machine }: MachineSelectDialogProps) => {


    const handleOk = (e: React.MouseEvent<HTMLButtonElement>) => {
        
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
            <AlertDialogAction>
                Yes
            </AlertDialogAction>

            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

}

export default MachineSelectDialog;