import { createMachine, createMachineType, saveCurrentMachine } from "@/data/api";
import { setCurrentMachine } from "@/data/store";
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
            const { data: type } =  await createMachineType("kiosk");
            const { data: machine} = await createMachine("Kiosk", type, 0);
            saveMachine(machine);

        } catch (e) {
            const errorMessage = (e as Error).message;
            toast.error("Sorry! There was an error saving the Machine  🙁", {
                description: errorMessage  
            });
        }
    }
    
    return { saveMachine, makeKiosk }
}

export default useMutationMachines;
