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

  const validateUser = async (cardNum: number): Promise<"machine_login" | "admin_dashboard" | "start_page" | "interlock">  => {
    try {
      const {
        data
      } = await getUser(cardNum);

      if (!data) {
        throw new Error("Could not find user! Please contact an admin to get registered.");
      }

      if (data.isAdmin() && !validCurrentMachine()) {
        return "machine_login";
      } else if(!data.isAdmin()) {
        clearCurrentUser();
        throw new Error("This interlock is not set-up! Please contact an admin to set-up this interlock.");
      }

      setCurrentUser(data);

      return data.isAdmin() ? "admin_dashboard" : "interlock";
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
