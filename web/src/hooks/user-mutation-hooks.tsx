import { addUser, 
    deleteUserById,
 } from "@/data/store";
import { User } from "@/data/types/user";
import { createUser, 
    createUserMachineRelation, 
    removeUser, 
    getUserCard,
    createUserBudgetCode,
    replaceBudgetsOfUser,
    replaceTrainingsOfUser,
    updateUserStatus,
    setAdminPasskey,
    validateAdminPass,
    verifyAdminPass} from "@/data/api";
import { useToast } from "./use-toast";

//primarily has functions handling state of decks after app is loaded, pretty much what's on posts UI
function useMutationUsers() {
  const { toast } = useToast();


  const checkAdminPass = async (userId: number) => {
    try {
      const res = await validateAdminPass(userId);

      return res;
    } catch (e) {

      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error checking 🙁",
        description: errorMessage
      })
    }
  }

  const verifyAdminPasskey = async (userId: number, pass: string) => {
    try {
      const res = await verifyAdminPass(userId, pass);

      return res;
    } catch (e) {

      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error checking 🙁",
        description: errorMessage
      })
    }
  }
  const createAdminPasskey = async (userId: number, passkey: string) => {
    try {
      console.log(userId);
      console.log(passkey);
      await setAdminPasskey(userId, passkey);


    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error logging in 🙁",
        description: errorMessage
      })
    }
  }

  const deleteUser = async (id: number) => {
    try {
      await removeUser(id); 
      deleteUserById(id); 

      toast({
        variant: "default",
        title: `✅ Success 😊!`,
        description: `User deactivated successfully!`
      })

    } catch (e) {
      //get message from api response, put it on a toast
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error removing a user 🙁",
        description: errorMessage
      })
    }
  };

  const addNewUser = async (user: User) => {
    try {    
      if (!user.graduationYear) {
        delete user.graduationYear;
      }
      const response : { message: string, data: User } = await createUser(user);
      addUser(response.data);
      toast({
        variant: "default",
        title: `✅ Success 😊!`,
        description: `${response.data.name} added successfully!`
      })
      return response;
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error adding a user 🙁",
        description: errorMessage
      })
    }
  };

  const giveBudgetCode = async (user_id: number, budget_code: number) => {
    try {
      await createUserBudgetCode(user_id, budget_code);
      toast({
        variant: "default",
        title: `✅ Success 😊!`, 
        description: "User budget codes updated."
      })
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an updating user budget codes 🙁",
        description: errorMessage
      })
    }
  };

  const setUserBudgetCodes = async (user_id: number, budget_codes: number[]) => {
    try {
      await replaceBudgetsOfUser(user_id, budget_codes);
      toast({
        variant: "default",
        title: `✅ Success 😊!`,
        description: "User budget codes updated."
      })
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an updating user budget codes 🙁",
        description: errorMessage
      })
    }
  };

  const setUserTrainings = async (user_id: number, machine_types: number[]) => {
    try {
      await replaceTrainingsOfUser(user_id, machine_types);
      toast({
        variant: "default",
        title: `✅ Success 😊!`,
        description: "User training records updated successfully!"
      })
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error updating trainings 🙁",
        description: errorMessage
      })
    }
  };

  const giveTraining = async (user_id: number, machine_id: number) => {
    try {
      await createUserMachineRelation(user_id, machine_id);
      toast({
        variant: "default",
        title: `✅ Success 😊!`,
        description: "User training record added successfully!"
      })
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error updating user trainings 🙁",
        description: errorMessage
      })
    }
  };


  /*
    const banUserById = async (user_id: number, ban: number) => {
        try {
        
          // const bannedUser = await banUser(user_id, ban); //using store functions to handle state of app
        //  banUserFlag(bannedUser.data.getId()); //edit user on front end
          
        }   catch (e) {
            //get message from api response, put it on a toast
            const errorMessage = (e as Error).message;
            toast.error("Sorry! There was an error banning a user 🙁", {
              description: errorMessage  
            });
          }
        };
  */

  const fetchUser = async (card: number) => {
    try {
      await getUserCard(card);
      toast({
        variant: "default",
        title: `✅ Success 😊!`,
        description: "User fetched successfully!"
      })
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error fetching the user 🙁",
        description: errorMessage
      })
    }
  };

  const modifyUser = async (user_id: number, active: number, graduationYear?: number, timeoutDate?: Date, admin: number = 0) => {
    try {
      await updateUserStatus(user_id, active, admin, graduationYear, timeoutDate);
      toast({
        variant: "default",
        title: `✅ Success 😊!`,
        description: "User updated successfully!"
      })
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error updating a user 🙁",
        description: errorMessage
      })
    }
  };

  return {
    deleteUser,
    addNewUser,
    giveTraining,
    giveBudgetCode,
    //banUserById,
    fetchUser,
    setUserBudgetCodes,
    setUserTrainings,
    modifyUser,
    checkAdminPass,
    createAdminPasskey,
    verifyAdminPasskey
  };
}

export default useMutationUsers;
