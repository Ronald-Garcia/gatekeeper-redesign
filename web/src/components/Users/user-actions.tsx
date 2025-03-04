import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"; 
import { useState } from "react";
import DeleteUserDialog from "./delete-user-dialogue";
import BanUserDialog from "./ban-user-dialog";
import AddTrainingDialog from "./add-training-dialog";

type UserActionsProps = {
  userId: number;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UserActions({ userId, setIsActive}: UserActionsProps) {
   const [ShowEditTraining, setShowEditTraining] = useState(false);
   const [ShowDeleteUser, setShowDeleteUser] = useState(false);
   const [ShowTimeoutUser, setShowTimeoutUser] = useState(false);


  const handleAddTraining = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditTraining(true);
    setIsActive(true);    
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteUser(true);
    setIsActive(true);   
  };

  const handleTimeout = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTimeoutUser(true);
    setIsActive(true);   
  };


  const handleCloseDelete = () => {
    setShowDeleteUser(false);
   
  };

  const handleCloseTimeout = () => {
    setShowTimeoutUser(false);

  };

  const handleCloseTraining = () => {
    setShowEditTraining(false);
  };


  return (

    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="absolute top-2 right-2 deck-actions">
          ...
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleAddTraining}>
          Add Training
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="delete-text-red">
          Delete
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTimeout} className="delete-text-red">
          Timeout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

{ShowEditTraining && (
  <AddTrainingDialog userId={userId} setShowEditTraining={handleCloseTraining} />
)}
{ShowDeleteUser && (
  <DeleteUserDialog
    userId={userId}
    setShowDeleteUser={handleCloseDelete}
  />
)}

{ShowTimeoutUser && (
  <BanUserDialog userId={userId} setShowBanUser={handleCloseTimeout} />
)}

</>
  );
}
