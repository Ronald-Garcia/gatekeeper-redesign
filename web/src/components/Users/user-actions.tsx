import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"; 

type UserActionsProps = {
  userId: number;
  isActive: (active: boolean) => void;
};

export default function UserActions({ userId, isActive }: UserActionsProps) {
  const handleAddTraining = () => {
    
  };

  const handleDelete = () => {
    console.log("Deleting user:", userId);
    isActive(true); 
  };

  const handleBan = () => {
    console.log("Banning user:", userId);
    isActive(true); 
  };

  return (
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
  );
}
