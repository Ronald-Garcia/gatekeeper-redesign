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
    isActive: (active: boolean) => void;
  
  };
  
  export default function BudgetCodeActions({ budgetcodeId, isActive }: BudgetCodeActionsProps) {
     const [ShowUpdateBudgetCode, setShowUpdateBudgetCode] = useState(false);
     const [ShowDeleteBudgetCode, setShowDeleteBudgetCode] = useState(false);

  
    const handleAddTraining = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowUpdateBudgetCode(true);
      isActive(true);
      
    };
  
    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowDeleteBudgetCode(true);
      isActive(true); 
    };
  
  
    const handleCloseDelete = () => {
      setShowDeleteBudgetCode(false);
      isActive(false); 
    };

    const handleCloseEdit = () => {
        setShowUpdateBudgetCode(false);
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
  