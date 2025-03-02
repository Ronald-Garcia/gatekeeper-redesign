import { createMachine, createMachineType, deleteMachine, saveCurrentMachine } from "@/data/api";
import { removeMachine, setCurrentMachine, setKiosk } from "@/data/store";
import { Machine } from "@/data/types/machine";
import { toast } from "sonner";



//primarily has functions handling state of decks after app is loaded, pretty much what's on posts UI
function useMutationMachines() {

    const saveMachine = async (machine: Machine) => {

        try {
            await saveCurrentMachine(machine.id);
            setCurrentMachine(machine);
        } catch (e) {
            const errorMessage = (e as Error).message;
            toast.error("Sorry! There was an error saving the Machine  🙁", {
                description: errorMessage  
            });
        }
    }

    const makeKiosk = async () => {
        try {

            await saveCurrentMachine(-1);
            setKiosk(true);

        } catch (e) {
            const errorMessage = (e as Error).message;
            toast.error("Sorry! There was an error saving the Machine  🙁", {
                description: errorMessage  
            });
        }
    }

    const removeMachineById = async (id: number) => {

        try {

            await deleteMachine(id);
            removeMachine(id);
        } catch (e) {
            const errorMessage = (e as Error).message;
            toast.error("Sorry! There was an error deleting the Machine  🙁", {
                description: errorMessage  
            });
        } 
    }

    const addMachine = async () => {
        try {

            await deleteMachine(id);
            removeMachine(id);
        } catch (e) {
            const errorMessage = (e as Error).message;
            toast.error("Sorry! There was an error deleting the Machine  🙁", {
                description: errorMessage  
            });
        } 
    }
    
    return { saveMachine, makeKiosk, removeMachineById }
}

export default useMutationMachines;
