import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"; 
import { useState } from "react";
import DeleteMachineDialog from "./delete-machine-dialogue";


type MachineActionsProps = {
  machineId: number;
};

export default function MachineActions({ machineId }: MachineActionsProps) {
  const [showDeleteMachine, setShowDeleteMachine] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteMachine(true);
  };

  const handleMaintenance = (e: React.MouseEvent) => {
    e.stopPropagation();
   // setShowMaintenanceMachine(true);
   // isActive(true); 
  };

  const handleCloseDelete = () => {
    setShowDeleteMachine(false);
  };


  return (
    <div data-cy={`machine-actions-${machineId}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="absolute top-2 right-2 deck-actions" data-cy={`machine-trigger-${machineId}`}>
            ...
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
        <DropdownMenuItem onClick={handleMaintenance} className="delete-text-red">
          Maintenance
        </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="delete-text-red" data-cy={`machine-delete-${machineId}`}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showDeleteMachine && (
        <DeleteMachineDialog
          machineId={machineId}
          setShowDeleteMachine={handleCloseDelete}
        />
      )}

     
    </div>
  );
}
