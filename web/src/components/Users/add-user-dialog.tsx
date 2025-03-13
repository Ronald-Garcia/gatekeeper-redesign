import { useState } from "react";
import useMutationUsers from "@/hooks/user-mutation-hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { User } from "@/data/types/user";
import useQueryUsers from "@/hooks/use-query-users";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";

 
// function that handles state of the dialogue, error handling from api
const AddUserDialog = () => {
  const { addNewUser } = useMutationUsers();
  const [name, setName] = useState("");
  const { loadUsers } = useQueryUsers(false);

  const [jhed, setJhed] = useState("");
  const [cardNum, setCardNum ] = useState("");
  // Default state of admin is 0 = not admin.
  const [admin, setAdmin] = useState(0);
  const [year, setYear] = useState("");

  const [open, setOpen] = useState(false);

  const handleOpenClose = () => {
    setOpen(!open);    
  }



  //async function with editing logic, including error handling
  const handleAddUser = async () => {

    const newUser: User = {
      name,
      JHED: jhed,
      isAdmin: admin,
      cardNum:cardNum,
      graduationYear: parseInt(year),
      id: -1}
    
    // Get that user so we can do some error checking
    const response = await addNewUser(newUser); //use hooks to handle state of training
    // If the created user is undefined, there was a problem.
    if (response) {

    }
    loadUsers();
  };


   const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
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

    // Function that handles clicking on the radio components.
    // Keep in mind, admin is by default set to 0.
    const handleOnClickAdmin = (toggleAdmin:boolean) => {
      // If clicked on yes, set as one.
      if (toggleAdmin) {
        setAdmin(1);
      }
      // If clicked on no, set as 0.
      else {
        setAdmin(0);
      }
    }

  return (
    <div data-cy = "user-add-dialog" >
    <Dialog open={open} onOpenChange={handleOpenClose}>
      <DialogTrigger asChild>
          <Button className="jhu-blue-button add-button h-[40px]" variant={"ghost"} size="default">
              Add User
          </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <Label htmlFor="content" className="text-sm">
          Please fill out form with new Student Information: 
        </Label>
        <div className="space-y-4">
        <Input
          onChange={handleOnChangeName}
          placeholder="Enter Student Name"
          data-cy = "enter-student-name"
        >
        </Input>
        </div>
        <div className="Swipe Card to Fill JCard ID">
        <Input
          onChange={handleOnChangeCardNum}
          placeholder="Card Number"
          data-cy = "enter-cardnum"
        >
        </Input>
    
        </div>

        <div className="Swipe Card to Fill JCard ID">
        <Input
          onChange={handleOnChangeJhed}
          placeholder="jhed"
          data-cy = "enter-jhed"

        >
        </Input>
    
        </div>

        <div className="Enter Graduation Year">
        <Input
          onChange={handleOnChangeYear}
          placeholder="year"
          data-cy = "enter-grad-year"
        >
        </Input>
        </div>
        
        <div className="is-admin-question">
          <div className="flex gap-2">
            Is this user an Administrator?
          </div>
        </div>
        <RadioGroup defaultValue="No">
          <div className="flex items-center space-x-2" onClick={() => handleOnClickAdmin(false)}>
            <RadioGroupItem value="No" id="r1"/>
            <Label htmlFor="r1">No</Label>
          </div>
          <div className="flex items-center space-x-2" onClick={() => handleOnClickAdmin(true)}>
            <RadioGroupItem value="Yes" id="r2"/>
            <Label htmlFor="r2">Yes</Label>
          </div>
        </RadioGroup>

        <DialogFooter>
          <DialogClose>
            <Button className = "jhu-white-button" variant={"ghost"} data-cy = "user-add-cancel" >Cancel</Button>
          </DialogClose>
          <DialogClose>
            <Button className = "jhu-blue-button" variant={"ghost"} data-cy = "user-add-confirm" onClick={handleAddUser}>Save Changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  );
};

export default AddUserDialog;
