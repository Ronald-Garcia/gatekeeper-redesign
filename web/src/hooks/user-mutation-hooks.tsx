//import { createDeck, deleteDeck, editDeck } from "@/data/api";
import { addUser, 
    deleteBudgetCode,
    addTraining,
    setUsers,
    deleteUserById
 } from "@/data/store";
import { toast } from "sonner";
import { useStore } from "@nanostores/react";
import useQueryUsers from "@/hooks/use-query-users";
import { User } from "@/components/components/types/user";
import { Training } from "@/components/components/types/training";
import { createUser } from "@/data/api";



//primarily has functions handling state of decks after app is loaded, pretty much what's on posts UI
function useMutationUsers() {
 
  const deleteUser = async (id: number) => {
    try {
    //  await removeUser(jhed); 
      deleteUserById(id); 

    } catch (e) {
      //get message from api response, put it on a toast
      const errorMessage = (e as Error).message;
      toast.error("Sorry! There was an error removing a user 🙁", {

        description: errorMessage

      })
    }
  };

  const addNewUser = async (user: User) => {
    try {    
      const { data } : { data: User } = await createUser(user);
      addUser(user);
      return data;
    }
      //get message from api response, put it on a toast
      catch (e) {
        //get message from api response, put it on a toast
        const errorMessage = (e as Error).message;
        toast.error("Sorry! There was an error adding a user 🙁", {
          description: errorMessage  
        });
      }
    };
  };

  //function that handles state of deck
  const giveTraining = async (user_id: number, machine_id: number) => {
    try {
      const traiining = await 
      addTraining(updatedUser.get, updatedUser.); //using store functions to handle state of app
    } catch (e) {
      //get message from api response, put it on a toast
      const errorMessage = (e as Error).message;
      toast.error("Sorry! There was an error adding a training 🙁", {

        description: errorMessage

      })
    }
  };

  return {
    deleteUserById,
    addNewUser,
    updateDeck,
  };
}

export default useMutationDecks;
