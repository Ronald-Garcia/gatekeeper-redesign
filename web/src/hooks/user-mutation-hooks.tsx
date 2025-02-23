//import { createDeck, deleteDeck, editDeck } from "@/data/api";
import { addUser, 
    deleteUser,
    deleteBudgetCode,
    addTraining,
    setUsers
 } from "@/data/store";
import { toast } from "@/components/ui/use-toast";
import { useStore } from "@nanostores/react";
import useQueryUsers from "@/hooks/use-query-users";
import { User } from "@/components/components/types/user";
import { Training } from "@/components/components/types/training";



//primarily has functions handling state of decks after app is loaded, pretty much what's on posts UI
function useMutationDecks() {
 
  const { loadUsers } = useQueryUsers();

  //function that deletes deck by id
  const deleteDeckById = async (jhed: string) => {
    try {
    //  await removeUser(jhed); 
      deleteUser(jhed); 

    } catch (error) {
      //get message from api response, put it on a toast
      const errorMessage = (error as Error).message;
      toast({
        variant: "destructive",
        title: "Sorry! There was an error deleting the user 🙁",
        description: errorMessage,
      });
    }
  };

  const addNewUser = async (user: User) => {
    try {
    
     // const newDeck = await createUser(user);
      addUser(user);
      await loadUsers(); // Refetch users to update the state
      return user;
    } catch (error) {
      //get message from api response, put it on a toast
      const errorMessage = (error as Error).message;
      toast({
        variant: "destructive",
        title: "Sorry! There was an error adding a new user 🙁",
        description: errorMessage,
      });
    }
  };

  //function that handles state of deck
  const giveTraining = async (jhed: string, training: Training) => {
    try {
      //const updatedUser = await addATraining(jhed, training); 
      addTraining(updatedUser.get, updatedUser.); //using store functions to handle state of app
      await loadDecks(currentPage); // Refetch decks to update the state
    } catch (error) {
      //get message from api response, put it on a toast
      const errorMessage = (error as Error).message;
      toast({
        variant: "destructive",
        title: "Sorry! There was an error updating the deck 🙁",
        description: errorMessage,
      });
    }
  };

  return {
    deleteDeckById,
    addNewDeck,
    updateDeck,
  };
}

export default useMutationDecks;
