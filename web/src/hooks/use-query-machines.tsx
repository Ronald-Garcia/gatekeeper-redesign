import { fetchCurrentMachine, getAllMachines, getAllTrainingsOfUser, getMachine, getMachineTypes } from "@/data/api";
import { setCurrentMachine, setCurTrainings, setKiosk, setMachines, setMachinesTypes, appendMachineTypes } from "@/data/store";
import { Machine } from "@/data/types/machine";
import { MachineType } from "@/data/types/machineType";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SortType } from "@/data/types/sort";

function useQueryMachines(reload: boolean) {
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast.error("Sorry! There was an error fetching Machines 🙁", {
        description: errorMessage  
      });
    }
  };

  const loadMachineTypes = async (
    sort: SortType = "asc",
    page: number = 1,
    limit: number = 10,
    search: string = "",
    append: boolean = false
  ) => {
    try {
      setIsLoading(true);
      const {
        data: fetchedMachineTypes,
        meta
      } = await getMachineTypes(sort, page, limit, search);
      
      if (append) {
        appendMachineTypes(fetchedMachineTypes);
      } else {
        setMachinesTypes(fetchedMachineTypes);
      }
      
      setHasMore(page * limit < meta.total);
      setCurrentPage(page);
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast.error("Sorry! There was an error fetching Machine Types 🙁", {
        description: errorMessage  
      });
    } finally {
      setIsLoading(false);
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
    currentPage,
    hasMore,
    isLoading
  };
}

export default useQueryMachines;