import { getAllUsers, getUser } from "@/data/api";
import { $users, 
  setUsers,
 } from "@/data/store";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { toast } from "sonner";

function useQueryUsers() {
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

  useEffect(() => {
    loadUsers();
  }, []);

  return { users, loadUsers };
}

export default useQueryUsers;
