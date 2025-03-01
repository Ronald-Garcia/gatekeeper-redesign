import { getAllUsers, getUser } from "@/data/api";
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

  const validateUser = async (cardNum: number): Promise<"machine_login" | "users" | "start_page" | "interlock">  => {
    try {
      const {
        data
      }: { message: string, data: User } = await getUser(cardNum);
      if (!data) {
        throw new Error("Could not find user! Please contact an admin to get registered.");
      }

      const curMachine = await getSavedMachine();
      if (data.isAdmin && !curMachine) {
        return "machine_login";
      } else if(!data.isAdmin && !curMachine) {
        clearCurrentUser();
        throw new Error("This interlock is not set-up! Please contact an admin to set-up this interlock.");
      }


      setCurrentUser(data);
      const ret = data.isAdmin ? "users" : "interlock";
      return ret;
    } catch (e) {
      console.log(e);
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
