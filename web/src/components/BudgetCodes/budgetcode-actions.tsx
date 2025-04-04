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
    const [ShowDeleteBudgetCode, setShowDeleteBudgetCode] = useState(false);

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowDeleteBudgetCode(true);
    };
  
    const handleCloseDelete = () => {
      setShowDeleteBudgetCode(false);
    };
  
    return (
      <div data-cy={`budget-code-actions-${budgetcodeId}`}>
      <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="absolute top-2 right-2 deck-actions" data-cy={`budget-code-trigger-${budgetcodeId}`} >
            ...
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleDelete} className="delete-text-red" data-cy={`budget-code-delete-${budgetcodeId}`} >
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
      </div>
    );
  }
  