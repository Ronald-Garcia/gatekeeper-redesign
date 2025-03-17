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
import TrainingDialog from "./training-dialog";
import BudgetCodeDialog from "./budget-code-dialog";

type UserActionsProps = {
  userId: number;
  userNumber:string;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UserActions({ userId, userNumber, setIsActive}: UserActionsProps) {
   const [ShowEditTraining, setShowEditTraining] = useState(false);
   const [ShowEditBudgetCode, setShowBudgetCode] = useState(false);
   const [ShowDeleteUser, setShowDeleteUser] = useState(false);
   const [ShowTimeoutUser, setShowTimeoutUser] = useState(false);


  const handleTraining = (e: React.MouseEvent) => {
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

  const handleBudgetCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBudgetCode(true);
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

  const handleCloseBudgetCode = () => {
    setShowBudgetCode(false);
  };


  return (

    <div data-cy = "user-actions" >
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost"  data-cy={`user-trigger-${userNumber}`} className="absolute top-2 right-2 deck-actions">
          ...
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleTraining}>
          Training
        </DropdownMenuItem>
        <DropdownMenuItem data-cy={`user-budget-code-${userNumber}`} onClick={handleBudgetCode}>
          Budget Code
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="delete-text-red" data-cy="user-delete">
          Delete
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTimeout} className="delete-text-red" data-cy="user-timeout">
          Timeout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

{ShowEditTraining && (
  <TrainingDialog userId={userId} setShowEditTraining={handleCloseTraining} />
)}
{ShowEditBudgetCode && (
  <BudgetCodeDialog userId={userId} setShowEditBudgetCode={handleCloseBudgetCode} />
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

</div>
  );
}
