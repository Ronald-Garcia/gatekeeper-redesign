import { useState } from "react";
import useMutationUsers from "@/hooks/user-mutation-hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";



//prop for handling state of the dialogue
type AddUserDialogProp = {
  userId: number;
  setShowAddUser: React.Dispatch<React.SetStateAction<boolean>>;
};

 
// function that handles state of the dialogue, error handling from api
const AddUserDialog = ({ userId, setShowAddUser }: AddUserDialogProp) => {
  const { addNewUser } = useMutationUsers();
  const [cardNum, setCardNum] = useState("");

  //async function with editing logic, including error handling
  const handleAddUser = async () => {

    
    // await addNewUser(userId); //use hooks to handle state of training
    setShowAddUser(false); //make the dialogue disappear
  };


   const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // setNewUser(e.target.value);
    }
  
  

  return (
    <Dialog open={true} onOpenChange={setShowAddUser}>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Training</DialogTitle>
        </DialogHeader>
        <Label htmlFor="content" className="text-sm">
          Please fill out form with new Student Information: 
        </Label>
        <div className="space-y-4">
        <Input
          onChange={handleOnChange}
          placeholder="Enter Student Name"
        >
        </Input>
        
        </div>
       
        <div className="space-y-4">
        <Input
          onChange={handleOnChange}
          placeholder="Email"
        >
        </Input>
        
    
        </div>
       
        <div className="Swipe Card to Fill JCard ID">
        <Input
          onChange={handleOnChange}
          placeholder="Card Number"
        >
        </Input>
    
        </div>
        <div className="Swipe Card to Fill JCard ID">
        <Input
          onChange={handleOnChange}
          placeholder="Admin"
        >
        </Input>
    
        </div>

        <div className="Swipe Card to Fill JCard ID">
        <Input
          onChange={handleOnChange}
          placeholder="jhed"
        >
        </Input>
    
        </div>
        <DialogFooter>
          <Button onClick={() => setShowAddUser(false)}>Cancel</Button>
          <Button onClick={handleAddUser}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
