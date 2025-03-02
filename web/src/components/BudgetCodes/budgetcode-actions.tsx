import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
  } from "@/components/ui/dropdown-menu";
  import { Button } from "@/components/ui/button"; 
  import { useState } from "react";
  import DeleteBudgetCodeDialog from "./delete-budgetCode-dialogue";
  import EditBudgetCodeDialog from "./edit-budgetCode-dialog.tsx";
  
  type BudgetCodeActionsProps = {
    budgetcodeId: number;  
  };
  
  export default function BudgetCodeActions({ budgetcodeId }: BudgetCodeActionsProps) {
     const [ShowUpdateBudgetCode, setShowUpdateBudgetCode] = useState(false);
     const [ShowDeleteBudgetCode, setShowDeleteBudgetCode] = useState(false);

  
    const handleAddTraining = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowUpdateBudgetCode(true);      
    };
  
    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowDeleteBudgetCode(true);
    };
  
  
    const handleCloseDelete = () => {
      setShowDeleteBudgetCode(false);
    };

    const handleCloseEdit = () => {
        setShowUpdateBudgetCode(false);
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
            Edit BudgetCode
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="delete-text-red">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  
  {ShowUpdateBudgetCode && (
    <EditBudgetCodeDialog budgetcodeId={budgetcodeId} setShowUpdateBudgetCode={handleCloseEdit} />
  )}
  {ShowDeleteBudgetCode && (
    <DeleteBudgetCodeDialog
      budgetcodeId={budgetcodeId}
      setShowDeleteBudgetCode={handleCloseDelete}
    />
  )}

  
  </>
    );
  }
  