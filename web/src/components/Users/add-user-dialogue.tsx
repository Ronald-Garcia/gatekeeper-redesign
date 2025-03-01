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
import { User } from "@/data/types/user";



//prop for handling state of the dialogue
type AddUserDialogProp = {
  userId: number;
  setShowAddUser: React.Dispatch<React.SetStateAction<boolean>>;
};

 
// function that handles state of the dialogue, error handling from api
const AddUserDialog = ({ setShowAddUser }: AddUserDialogProp) => {
  const { addNewUser } = useMutationUsers();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jhed, setJhed] = useState("");
  const [cardNum, setCardNum ] = useState("");
  const [admin, setAdmin] = useState(0);
  const [year, setYear] = useState("");


  //async function with editing logic, including error handling
  const handleAddUser = async () => {

    const newUser: User = {
      name,
      JHED: jhed,
      isAdmin: admin,
      cardNum,
      graduationYear: parseInt(year),
      lastDigitOfCardNum: 0,
      id: -1}
    
    await addNewUser(newUser); //use hooks to handle state of training
    setShowAddUser(false); //make the dialogue disappear
  };


   const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    }

    const handleOnChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    }

    const handleOnChangeCardNum = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCardNum(e.target.value);
    }

    const handleOnChangeYear = (e: React.ChangeEvent<HTMLInputElement>) => {
      setYear(e.target.value);
    }

    const handleOnChangeJhed = (e: React.ChangeEvent<HTMLInputElement>) => {
      setJhed(e.target.value);
    }

    const handleOnChangeAdmin = () => {
      setAdmin(admin ^ 1);
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
          onChange={handleOnChangeName}
          placeholder="Enter Student Name"
        >
        </Input>
        
        </div>
       
        <div className="space-y-4">
        <Input
          onChange={handleOnChangeEmail}
          placeholder="Email"
        >
        </Input>
        
    
        </div>
       
        <div className="Swipe Card to Fill JCard ID">
        <Input
          onChange={handleOnChangeCardNum}
          placeholder="Card Number"
        >
        </Input>
    
        </div>
        <div className="Swipe Card to Fill JCard ID">
        <input
          type="check"
          onChange={handleOnChangeAdmin}
          placeholder="Admin"
        >
        </input>
    
        </div>

        <div className="Swipe Card to Fill JCard ID">
        <Input
          onChange={handleOnChangeJhed}
          placeholder="jhed"
        >
        </Input>
    
        </div>

        <div className="Swipe Card to Fill JCard ID">
        <Input
          onChange={handleOnChangeYear}
          placeholder="year"
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
