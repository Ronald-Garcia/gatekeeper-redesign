import {  createMachineType, deleteMachine, saveCurrentMachine, deleteMachineType } from "@/data/api";
import { addNewMachineType, deleteOldMachineType, removeMachine, setCurrentMachine, setKiosk } from "@/data/store";
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

           // await addMachine(id);
          //  addMachineby(id);
        } catch (e) {
            const errorMessage = (e as Error).message;
            toast.error("Sorry! There was an error deleting the Machine  🙁", {
                description: errorMessage  
            });
        } 
    }


    const addMachineType = async (type:string) => {
        try {

            const {data } = await createMachineType(type);
           addNewMachineType(data);
        } catch (e) {
            const errorMessage = (e as Error).message;
            toast.error("Sorry! There was an error adding the Machine Type  🙁", {
                description: errorMessage  
            });
        } 
        
    }

    const deleteMachineType = async (id:number) => {
        try {

            await deleteMachineType(id);
            deleteOldMachineType(id);
        } catch (e) {
            const errorMessage = (e as Error).message;
            toast.error("Sorry! There was an error deleting the Machine Type  🙁", {
                description: errorMessage  
            });
        } 
        
    }

    
    return { saveMachine, makeKiosk, removeMachineById, addMachine, addMachineType, deleteMachineType}
}

export default useMutationMachines;
