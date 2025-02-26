import { getAllUsers, getUser } from "@/data/api";
import { $users, 
  clearCurrentUser, 
  setCurrentUser, 
  setUsers,
  validCurrentMachine,
 } from "@/data/store";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { toast } from "sonner";

function useQueryUsers(reload: boolean) {
  const users = useStore($users);
  

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

  const validateUser = async (cardNum: number): Promise<"setup" | "ready" | "error">  => {
    try {
      const {
        data
      } = await getUser(cardNum);

      if (!data) {
        throw new Error("Could not find user! Please contact an admin to get registered.");
      }

      if (data.isAdmin() && !validCurrentMachine()) {
        return "setup";
      } else if(!data.isAdmin()) {
        clearCurrentUser();
        throw new Error("This interlock is not set-up! Please contact an admin to set-up this interlock.");
      }

      return "ready";
    } catch (e) {
      const errorMessage = (e as Error).message;
        toast.error("Sorry! There was an error 🙁", {
          description: errorMessage  
        });
      return "error";
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
