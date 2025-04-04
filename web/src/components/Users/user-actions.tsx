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
  userNumber: string;
};

export default function UserActions({ userId, userNumber }: UserActionsProps) {
  const [showEditTraining, setShowEditTraining] = useState(false);
  const [showEditBudgetCode, setShowBudgetCode] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [showTimeoutUser, setShowTimeoutUser] = useState(false);

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

{showEditTraining && (
  <TrainingDialog userId={userId} setShowEditTraining={handleCloseTraining} />
)}
{showEditBudgetCode && (
  <BudgetCodeDialog userId={userId} setShowEditBudgetCode={handleCloseBudgetCode} />
)}
{showDeleteUser && (
  <DeleteUserDialog
    userId={userId}
    setShowDeleteUser={handleCloseDelete}
  />
)}

{showTimeoutUser && (
  <BanUserDialog userId={userId} setShowBanUser={handleCloseTimeout} />
)}

</div>
  );
}
