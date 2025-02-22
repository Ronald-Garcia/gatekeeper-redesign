import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
  } from "@/components/ui/dropdown-menu";

export default function user-actions{

    type userActionsProps {
        // user 
     isActive : (active: boolean) => void;
    };

    handleAddTraining() => {
        
    }


    return (
        <>
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="absolute top-2 right-2 deck-actions"
          >
            ...
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleAddTraining}>Add Training</DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="delete-text-red">Delete</DropdownMenuItem>
          <DropdownMenuItem onClick={handleBan} className="delete-text-red">Ban</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
        </>
    )





}