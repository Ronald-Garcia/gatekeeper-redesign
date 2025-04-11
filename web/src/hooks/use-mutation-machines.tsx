import {  updateMachine, createMachine, createMachineType, deleteMachine, saveCurrentMachine } from "@/data/api";
import { addNewMachineType, appendMachine, deleteOldMachineType, removeMachine, setCurrentMachine, setKiosk } from "@/data/store";
import { Machine } from "@/data/types/machine";
import { useToast } from "./use-toast";

//primarily has functions handling state of decks after app is loaded, pretty much what's on posts UI but for this application

function useMutationMachines() {
    const { toast } = useToast();

    /**
      Hook to save machine
      @param machine: machine to save 
    */
    const saveMachine = async (machine: Machine) => {
        try {
            await saveCurrentMachine(machine.id);
            setCurrentMachine(machine);
            toast({
                variant: "default",
                title: "✅ Success 😊!",
                description: "Machine saved successfully!"
            });
        } catch (e) {
            const errorMessage = (e as Error).message;
            toast({
                variant: "destructive",
                title: "❌ Sorry! There was an error saving the Machine 🙁",
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
            toast({
                variant: "default", 
                title: "✅ Success 😊!",
                description: "Kiosk mode set successfully!"
            });
        } catch (e) {
            const errorMessage = (e as Error).message;
            toast({
                variant: "destructive",
                title: "❌ Sorry! There was an error setting kiosk mode 🙁",
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
            toast({
                variant: "default",
                title: "✅ Success 😊!",
                description: "Machine removed successfully!"
            });
        } catch (e) {
            const errorMessage = (e as Error).message;
            toast({
                variant: "destructive",
                title: "❌ Sorry! There was an error deleting the Machine 🙁",
                description: errorMessage
            });
        } 
    }


  const modifyMachine = async (machine_id: number, active: number) => {
    try {
      await updateMachine(machine_id, active);
      toast({
        variant: "default",
        title: `✅ Success 😊!`, 
        description: "Machine modified successfully!"
      })
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error modifying the machine 🙁",
        description: errorMessage
      })
    }
  };
    /*
    Hook to add machine
    */
    const addMachine = async (machineName:string, type:number, rate:number, active:number = 1 ) => {
        try {
            const {data} = await createMachine(machineName, type, rate, active);
            appendMachine(data);
            toast({
                variant: "default",
                title: "✅ Success 😊!",
                description: "Machine added successfully!"
            });
            return (data);
        } catch (e) {
            const errorMessage = (e as Error).message;
            toast({
                variant: "destructive",
                title: "❌ Sorry! There was an error adding the Machine 🙁",
                description: errorMessage
            });
        }
    }

    /*
    Hook to add MachineType
    * @param type: name of the new type of macine to be added
    */
    const addMachineType = async (type:string) => {
        try {
            const {data } = await createMachineType(type);
            addNewMachineType(data);
            toast({
                variant: "default",
                title: "✅ Success 😊!",
                description: "Machine type added successfully!"
            });
        } catch (e) {
            const errorMessage = (e as Error).message;
            toast({
                variant: "destructive",
                title: "❌ Sorry! There was an error adding the Machine Type 🙁",
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
            toast({
                variant: "default",
                title: "✅ Success 😊!",
                description: "Machine type deleted successfully!"
            });
        } catch (e) {
            const errorMessage = (e as Error).message;
            toast({
                variant: "destructive",
                title: "❌ Sorry! There was an error deleting the Machine Type 🙁",
                description: errorMessage
            });
        } 
    }

    return { saveMachine, makeKiosk, removeMachineById, addMachine, addMachineType, deleteMachineType, modifyMachine}
}

export default useMutationMachines;
