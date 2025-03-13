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

function useQueryUsers(reload: boolean) {
  const users = useStore($users);
  const { getSavedMachine } = useQueryMachines(false);

  const loadUsers = async () => {
    try {
      const {
        data: fetchedUsers
      } = await getAllUsers();
      setUsers(fetchedUsers);
    }  catch (e) {
        //get message from api response, put it on a toast
        const errorMessage = (e as Error).message;
        toast.error("Sorry! There was an error fetching Users 🙁", {
          description: errorMessage  
        });
      }
    };

  const validateUser = async (cardNum: number, callPython:number): Promise<"machine_login" | "users" | "start_page" | "interlock">  => {
    try {
      const {
        data
      }: { message: string, data: User } = await getUser(cardNum);
      if (!data) {
        throw new Error("Could not find user! Please contact an admin to get registered.");
      }

      let curMachine: Machine | "kiosk" | undefined
      // Call python refers to calling the machine api backend. If we are not
      // on a machine, aka we are online, don't call the machine-api, since it 
      // does not exist. Just default to kiosk
      if (callPython){
        curMachine = await getSavedMachine();
      } else {
        curMachine = "kiosk";
      }

      if (!curMachine) {
        if (data.isAdmin) {
          return "machine_login"
        }

        clearCurrentUser();
        throw new Error("This interlock is not set-up! Please contact an admin to set-up this interlock.");
      }

      if (curMachine === "kiosk" && data.isAdmin) {
        return "users";
      } else if (curMachine === "kiosk") {
        clearCurrentUser();
        throw new Error("This machine is only accessible for admins!");
      }


      const { data: ableToUse } = await validateTraining(data.id, curMachine.id);

      setCurrentUser(data);
      if (!ableToUse) {
        throw new Error("User does not have access to this machine!");
      }
      const ret = curMachine.type.name === "kiosk" ? "users" : "interlock";
      return ret;
    } catch (e) {
      const errorMessage = (e as Error).message;
        toast.error("Sorry! There was an error 🙁", {
          description: errorMessage  
        });
      return "start_page";
    }
  }

  useEffect(() => {
    if (reload) {
      loadUsers();
    }
  }, []);

  return { users, loadUsers, validateUser };
}

export default useQueryUsers;
