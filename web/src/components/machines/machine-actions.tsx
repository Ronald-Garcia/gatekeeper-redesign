import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"; 
import { useState } from "react";
import DeleteMachineDialog from "./delete-user-dialogue";

type MachineActionsProps = {
  machineId: number;

};

export default function MachineActions({ machineId }: MachineActionsProps) {
   const [ShowDeleteMachine, setShowDeleteMachine] = useState(false);
   const [ShowMaintenanceMachine, setShowMaintenanceMachine] = useState(false);


  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteMachine(true);
   // isActive(true); 
  };

  const handleMaintenance = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMaintenanceMachine(true);
   // isActive(true); 
  };


  const handleCloseDelete = () => {
    setShowDeleteMachine(false);
   // isActive(false); 
  };

  const handleCloseBan = () => {
    setShowMaintenanceMachine(false);
   // isActive(false); 
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
        <DropdownMenuItem onClick={handleMaintenance} className="delete-text-red">
          Maintenance
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

{ShowDeleteMachine && (
  <DeleteMachineDialog
    machineId={machineId}
    setShowDeleteMachine={handleCloseDelete}
  />
)}

{/* {ShowBanUser && (
  <BanUserDialog userId={userId} setShowBanUser={handleCloseBan} />
)} */}

</>
  );
}
