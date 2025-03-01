import { addUser, 
    deleteUserById,
    updateUserById,
 } from "@/data/store";
import { toast } from "sonner";
import { User } from "@/data/types/user";
import { createUser, 
    createUserMachineRelation, 
    removeUser, 
    editUser, 
    getUser} from "@/data/api";



//primarily has functions handling state of decks after app is loaded, pretty much what's on posts UI
function useMutationUsers() {
 
  const deleteUser = async (id: number) => {
    try {
      await removeUser(id); 
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
      const { data } : { message: string, data: User } = await createUser(user);
      addUser(data);
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


  //function that handles state of deck
  const giveTraining = async (user_id: number, machine_id: number) => {
    try {
      await createUserMachineRelation(user_id, machine_id);

    } catch (e) {
        //get message from api response, put it on a toast
        const errorMessage = (e as Error).message;
        toast.error("Sorry! There was an error creating machine relation 🙁", {
          description: errorMessage  
        });
      }
    };

   const updateUser = async (newUser: User) => {
    try {
    
      const { data } = await editUser(newUser); //using store functions to handle state of app
       updateUserById(data); //edit deck on api
      
    }   catch (e) {
        //get message from api response, put it on a toast
        const errorMessage = (e as Error).message;
        toast.error("Sorry! There was an error updating a user 🙁", {
          description: errorMessage  
        });
      }
    };


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


      const fetchUser = async (card: number) => {
          try {
          const currUser = await getUser(card); 
      
          } catch (e) {
            //get message from api response, put it on a toast
            const errorMessage = (e as Error).message;
            toast.error("Sorry! There was an error removing a user 🙁", {
      
              description: errorMessage
      
            })
          }
        };


      
  return {
    deleteUser,
    addNewUser,
    giveTraining,
    updateUser,
    banUserById,
    fetchUser
  }
}


export default useMutationUsers;
