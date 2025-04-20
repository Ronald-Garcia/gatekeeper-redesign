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
import { User } from "@/data/types/user";
import ActivateUserDialog from "./activate-user";

type UserActionsProps = {
  user: User;
};

export default function UserActions({ user }: UserActionsProps) {
  const [showEditTraining, setShowEditTraining] = useState(false);
  const [showEditBudgetCode, setShowBudgetCode] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [showTimeoutUser, setShowTimeoutUser] = useState(false);
  const [showActivateUser, setShowActivateUser] = useState(false);
  
  const handleTraining = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditTraining(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteUser(true);
  };

  const handleTimeout = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTimeoutUser(true);
  };

  const handleBudgetCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBudgetCode(true);
  };

  const handleActivate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActivateUser(true);
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

  const handleCloseActivate = () => {
    setShowActivateUser(false);
  };


  return (
    <div data-cy = "user-actions" >
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost"  data-cy={`user-trigger-${user.cardNum}`} className="absolute top-2 right-2 deck-actions">
          ...
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        { user.active === 1 && <DropdownMenuItem data-cy={`user-training-${user.cardNum}`}  onClick={handleTraining}>
          Training
        </DropdownMenuItem>}
        { user.active === 1 && <DropdownMenuItem data-cy={`user-budget-code-${user.cardNum}`} onClick={handleBudgetCode}>
          Budget Code
        </DropdownMenuItem>}
        {user.active === 1 && <DropdownMenuItem onClick={handleDelete} className="delete-text-red" data-cy="user-delete">
          Deactivate
        </DropdownMenuItem>}
        {user.active === 0 && <DropdownMenuItem onClick={handleActivate} className="delete-text-red" data-cy="user-activate">
          Activate
        </DropdownMenuItem>}
        {user.active === 1 &&<DropdownMenuItem onClick={handleTimeout} className="delete-text-red" data-cy="user-timeout">
          Timeout
        </DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>

{showEditTraining && (
  <TrainingDialog userId={user.id} setShowEditTraining={handleCloseTraining} />
)}
{showEditBudgetCode && (
  <BudgetCodeDialog userId={user.id} setShowEditBudgetCode={handleCloseBudgetCode} />
)}
{showDeleteUser && (
  <DeleteUserDialog
    userId={user.id}
    setShowDeleteUser={handleCloseDelete}
  />
)}

{showTimeoutUser && (
  <BanUserDialog userId={user.id} setShowBanUser={handleCloseTimeout} />
)}

{showActivateUser && (
  <ActivateUserDialog user={user} setShowActivateUser={handleCloseActivate} />
)}

</div>
  );
}
