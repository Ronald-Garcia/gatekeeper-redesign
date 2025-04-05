import { fetchCurrentMachine, getAllMachines, getAllTrainingsOfUser, getMachine, getMachineTypes } from "@/data/api"
import { setCurrentMachine, setCurTrainings, setKiosk, setMachines, setMachinesTypes, appendMachineTypes,setMetaData } from "@/data/store";
import { Machine } from "@/data/types/machine";
import { MachineType } from "@/data/types/machineType";

import { SortMachineType } from "@/data/types/sort";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import { SortType } from "@/data/types/sort";

function useQueryMachines(reload: boolean) {
  // Pagination state for machine types (used for infinite scroll)
  const [machineTypesCurrentPage, setMachineTypesCurrentPage] = useState(1);
  const [machineTypesHasMore, setMachineTypesHasMore] = useState(false);
  const [machineTypesIsLoading, setMachineTypesIsLoading] = useState(false);

  const getSavedMachine = async (): Promise<Machine | "kiosk" | undefined | 0> => {
    try {
      const { data } = await fetchCurrentMachine();

      if (data === null) {
        return undefined;
      }

      if (data === -1) {
        setKiosk(true);
        return "kiosk";
      }

      try {
        const { data: machine } = await getMachine(data);
        setCurrentMachine(machine);
        return machine;
      } catch (e) {
        const errorMessage = (e as Error).message;
        toast.error("Sorry! There was an error fetching the Machine  🙁", {
          description: errorMessage  
        });
        return 0;            
      }
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast.error("Sorry! There was an error fetching the Machine  🙁", {
        description: errorMessage  
      });
      return 0;
    }    
  }

  const loadMachineTypes = async (
    sort: SortType = "asc",
    page: number = 1,
    limit: number = 10,
    search: string = "",
    append: boolean = false
  ) => {
    try {
      setMachineTypesIsLoading(true);
      const {
        data: fetchedMachineTypes,
        meta
      } = await getMachineTypes(sort, page, limit, search);
      
      if (append) {
        appendMachineTypes(fetchedMachineTypes);
      } else {
        setMachinesTypes(fetchedMachineTypes);
      }
      
      setMachineTypesHasMore(page * limit < meta.total);
      setMachineTypesCurrentPage(page);
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast.error("Sorry! There was an error fetching Machine Types 🙁", {
        description: errorMessage  
      });
    } finally {
      setMachineTypesIsLoading(false);
    }
  };

  const getTrainingsOfUser = async (userId: number): Promise<MachineType[] | undefined> => {
    try {
      const {
        data: types
      } = await getAllTrainingsOfUser(userId);
      setCurTrainings(types);
      return types;
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast.error("Sorry! There was an error fetching Machine Types  🙁", {
        description: errorMessage  
      });
    }
  }

  const loadMachines = async (
    sort: SortMachineType = "name_asc",
    page: number = 1,
    limit: number = 10,
    search: string = ""
    ) => {
      try {
        const {
          data: fetchedMachines,
          meta: fetchedMetaData
        } = await getAllMachines(sort, page, limit, search);
        setMetaData(fetchedMetaData);
        setMachines(fetchedMachines);
      }  catch (e) {
          //get message from api response, put it on a toast
          const errorMessage = (e as Error).message;
          toast.error("Sorry! There was an error fetching Users 🙁", {
            description: errorMessage  
          });
        }
      };

  useEffect(() => {
    if (reload) {
      loadMachines();
      loadMachineTypes();
    }
  }, []);

  return { 
    getSavedMachine, 
    loadMachines, 
    loadMachineTypes, 
    getTrainingsOfUser,
    // Only expose machine types pagination for infinite scroll
    currentPage: machineTypesCurrentPage,
    hasMore: machineTypesHasMore,
    isLoading: machineTypesIsLoading
  };
}

export default useQueryMachines;