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
  isActive: (active: boolean) => void;

};

export default function UserActions({ userId, isActive }: UserActionsProps) {
   const [ShowEditTraining, setShowEditTraining] = useState(false);
   const [ShowDeleteUser, setShowDeleteUser] = useState(false);
   const [ShowBanUser, setShowBanUser] = useState(false);


  const handleAddTraining = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditTraining(true);
    isActive(true);
    
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteUser(true);
    isActive(true); 
  };

  const handleBan = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBanUser(true);
    isActive(true); 
  };


  const handleCloseDelete = () => {
    setShowDeleteUser(false);
    isActive(false); 
  };

  const handleCloseBan = () => {
    setShowBanUser(false);
    isActive(false); 
  };

  const handleCloseTraining = () => {
    setShowBanUser(false);
    isActive(false); 
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
        <DropdownMenuItem onClick={handleBan} className="delete-text-red">
          Ban
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

{ShowBanUser && (
  <BanUserDialog userId={userId} setShowBanUser={handleCloseBan} />
)}

</>
  );
}
