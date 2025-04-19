import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"; 
import { useState } from "react";
import DeleteMachineDialog from "./delete-machine-dialogue";
import { Machine } from "@/data/types/machine";
import ActivateMachineDialog from "./activate-machine";


type MachineActionsProps = {
  machine: Machine;
};

export default function MachineActions({ machine }: MachineActionsProps) {
   const [ShowDeleteMachine, setShowDeleteMachine] = useState(false);
   const [ShowActiveStatus, setShowActiveMachine] = useState(false);
  // const [ShowMaintenanceMachine, setShowMaintenanceMachine] = useState(false);


  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteMachine(true);
  };

  const handleMaintenance = (e: React.MouseEvent) => {
    e.stopPropagation();
   // setShowMaintenanceMachine(true);
   // isActive(true); 
  };

  const handleActiveStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActiveMachine(true);
    // isActive(true); 
  };

  const handleCloseDelete = () => {
    setShowDeleteMachine(false);
  };


  return (
    <div data-cy={`machine-actions-${machine.id}`}>

      

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="absolute top-2 right-2 deck-actions" data-cy={`machine-trigger-${machine.id}`}>
            ...
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
        {machine.active ? <DropdownMenuItem data-cy={`machine-deactivate-${machine.id}`} onClick={handleDelete} className="delete-text-red">
          Deactivate
        </DropdownMenuItem> : <DropdownMenuItem  data-cy={`machine-activate-${machine.id}`} onClick={handleActiveStatus}>
          Activate
        </DropdownMenuItem>}
        <DropdownMenuItem onClick={handleMaintenance} data-cy={`machine-maintenance-${machine.id}`} className="delete-text-red">
          Maintenance
        </DropdownMenuItem>
        
      </DropdownMenuContent>
    </DropdownMenu>

{ShowDeleteMachine && (
  <DeleteMachineDialog
    machineId={machine.id}
    setShowDeleteMachine={handleCloseDelete}
  />
)}

{ShowActiveStatus && (
  <ActivateMachineDialog
  machine={machine}
  setShowActivateMachine={setShowActiveMachine}>

  </ActivateMachineDialog>
)}

     
    </div>
  );
}
