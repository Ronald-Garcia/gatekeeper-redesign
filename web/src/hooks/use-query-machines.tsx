import { fetchCurrentMachine, getAllMachines, getMachine, getMachineTypes } from "@/data/api";
import { setCurrentMachine, setKiosk, setMachines, setMachinesTypes} from "@/data/store";
import { Machine } from "@/data/types/machine";
import { useEffect } from "react";
import { toast } from "sonner";


function useQueryMachines(reload: boolean) {


    const getSavedMachine = async (): Promise<Machine | "kiosk" | undefined> => {
        
        try {
            const { data } = await fetchCurrentMachine();
            if (data === -1) {
                setKiosk(true);
                return "kiosk";
            }
            const { data: machine } = await getMachine(data);
            setCurrentMachine(machine);
            return machine;
        } catch (e) {
          
            const errorMessage = (e as Error).message;
            toast.error("Sorry! There was an error fetching the Machine  🙁", {
                description: errorMessage  
            });
        }

    }

    const loadMachines = async () => {
        try {
          const {
            data: fetchedMachines
          } = await getAllMachines();
          setMachines(fetchedMachines);
        }  catch (e) {
            //get message from api response, put it on a toast
            const errorMessage = (e as Error).message;
            toast.error("Sorry! There was an error fetching Users 🙁", {
              description: errorMessage  
            });
          }
        };


    const loadMachineTypes = async () => {
        try {
            const {
              data: fetchedMachinesTypes
            } = await getMachineTypes();
            setMachinesTypes(fetchedMachinesTypes);
          }  catch (e) {
              //get message from api response, put it on a toast
              const errorMessage = (e as Error).message;
              toast.error("Sorry! There was an error fetching Users 🙁", {
                description: errorMessage  
              });
            }
          };
    


    useEffect(()=> {
        if (reload) {
            loadMachines();
            loadMachineTypes();
        }
    }, [])

    return { getSavedMachine, loadMachines, loadMachineTypes}


}

export default useQueryMachines;