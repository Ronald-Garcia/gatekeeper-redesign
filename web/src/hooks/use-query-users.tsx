import { getAllUsers, getUser, validateTraining } from "@/data/api";
import { $users, 
  clearCurrentUser, 
  setCurrentUser, 
  setUsers,
 } from "@/data/store";
import { User } from "@/data/types/user";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { toast } from "sonner";
import useQueryMachines from "./use-query-machines";
import { Machine } from "@/data/types/machine";
import { SortType } from "@/data/types/sort";
import { $router } from "@/data/router";

function useQueryUsers(reload: boolean) {
  const users = useStore($users);
  const router = useStore($router);
  const { getSavedMachine } = useQueryMachines(false);

  const loadUsers = async (
    sort: SortType = "name_asc",
    page: number = 1,
    limit: number = 10,
    search: string = ""
  ) => {
    try {
      const {
        data: fetchedUsers
      } = await getAllUsers(sort,page,limit,search);
      setUsers(fetchedUsers);
    }  catch (e) {
        //get message from api response, put it on a toast
        const errorMessage = (e as Error).message;
        toast.error("Sorry! There was an error fetching Users 🙁", {
          description: errorMessage  
        });
      }
    };

  const validateUser = async (cardNum: number, callPython:number): Promise<"machine_login" | "users" | "start_page" | "interlock" | "kiosk">  => {
    try {
      const {
        data
      }: { message: string, data: User } = await getUser(cardNum);
      if (!data) {
        throw new Error("Could not find user! Please contact an admin to get registered.");
      }

      
      setCurrentUser(data);


      let curMachine: Machine | "kiosk" | undefined | 0
      // Call python refers to calling the machine api backend. If we are not
      // on a machine, aka we are online, don't call the machine-api, since it 
      // does not exist. Just default to kiosk
      if (callPython){
        curMachine = await getSavedMachine();
      } else {
        curMachine = "kiosk";
      }


      // if curMachine === 0, then machine is inactive or not found
      if (curMachine === 0) {
        return (router!.route as "start_page" | "kiosk");
      }

      //If there is no env file and they are admin, let them choose a machine.
      if (!curMachine) {
        if (data.isAdmin) {
          return "machine_login"
        }

        //Otherwise, throw an error.
        throw new Error("This interlock is not set-up! Please contact an admin to set-up this interlock.");
      }

      //If the machine is a kiosk and user is admin, let them access.
      if (curMachine === "kiosk" && data.isAdmin) {
        return "users";
      } else if (curMachine === "kiosk") {
        throw new Error("This machine is only accessible for admins!");
      }

      //Otherwise, we have a machine, and need to validate them.
      const { data: ableToUse } = await validateTraining(data.id, curMachine.id);

      if (!ableToUse) {
        throw new Error("User does not have access to this machine!");
      }

      // If here, we have a non kiosk machine and are able to use it. Redirect to interlock
      const ret = "interlock";
      return ret;

    } catch (e) { //If there was an error anywhere, redirect to the start page.
      clearCurrentUser();

      clearCurrentUser();

      const errorMessage = (e as Error).message;
        toast.error("Sorry! There was an error 🙁", {
          description: errorMessage  
        });
      return (router!.route as "start_page" | "kiosk");
      return (router!.route as "start_page" | "kiosk");
    }
  }

  useEffect(() => {
    // Check if there is active search. If yes, use load users with that search
    if (reload) {
      loadUsers();
    }
  }, []);

  return { users, loadUsers, validateUser };
}

export default useQueryUsers;