import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
  } from "@/components/ui/dropdown-menu";
  import { Button } from "@/components/ui/button"; 
  import { useState } from "react";
  import DeleteBudgetCodeDialog from "./delete-budgetCode-dialogue";

  
  type BudgetCodeActionsProps = {
    budgetcodeId: number;  
  };
  
  export default function BudgetCodeActions({ budgetcodeId }: BudgetCodeActionsProps) {
    // const [ShowUpdateBudgetCode, setShowUpdateBudgetCode] = useState(false);
     const [ShowDeleteBudgetCode, setShowDeleteBudgetCode] = useState(false);

  
    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowDeleteBudgetCode(true);
    };
  
  
    const handleCloseDelete = () => {
      setShowDeleteBudgetCode(false);
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
          <DropdownMenuItem onClick={handleDelete} className="delete-text-red">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  
 
  {ShowDeleteBudgetCode && (
    <DeleteBudgetCodeDialog
      budgetcodeId={budgetcodeId}
      setShowDeleteBudgetCode={handleCloseDelete}
    />
  )}

  
  </>
    );
  }
  