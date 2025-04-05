import {  activateMachine, createMachine, createMachineType, deleteMachine, saveCurrentMachine } from "@/data/api";
import { addNewMachineType, appendMachine, deleteOldMachineType, removeMachine, setCurrentMachine, setKiosk } from "@/data/store";
import { Machine } from "@/data/types/machine";
import { MachineType } from "@/data/types/machineType";
import { toast } from "sonner";



//primarily has functions handling state of decks after app is loaded, pretty much what's on posts UI but for this application

function useMutationMachines() {

    /**
      Hook to save machine
      @param machine: machine to save 
    */
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

     /*
      Hook to make kiosk, set current machine as the kiosk
    */
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

    /*
    Hook to remove the machine
    @param id: id of machine to remove
    */
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

    /*
    Hook to add machine
    */
    const addMachine = async (machineName:string, type:number, rate:number, active:number = 1 ) => {
        try {
            const {data} = await createMachine(machineName, type, rate, active);
            appendMachine(data);
            return (data);
        } catch (e) {
            const errorMessage = (e as Error).message;
            toast.error("Sorry! There was an error adding the Machine  🙁", {
                description: errorMessage  
            });
        }
    }

    /*
    Hook to add MachineType
    @param type: name of the new type of macine to be added
    */
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

     /*
    Hook to delete MachineType
    @param id: id of the machinetype to delete
    */
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

    const enableMachine = async (id:number) => {
        try {
            await activateMachine(id);
            return true;
            
        } catch (error) {
            const errorMessage = (error as Error).message;
            toast.error("Sorry! There was an error activating the Machine  🙁", {
                description: errorMessage  
            });
        }
    }

    
    return { saveMachine, makeKiosk, removeMachineById, addMachine, addMachineType, deleteMachineType, enableMachine}
}

export default useMutationMachines;
