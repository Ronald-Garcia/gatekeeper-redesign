import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
  } from "@/components/ui/dropdown-menu";
  import { Button } from "@/components/ui/button"; 
  import { useState } from "react";
  import DeleteMachineTypeDialog from "./remove-machine-type-dialog";
  
  type MachineTypeActionsProps = {
    machineTypeId: number;
  };
  
  /*
  Machine type actions element, to manage state of the dialogs for the delete action on machine types
  @param machineTypeId: to prop drill the typeId to the action dialog's to perform CRUD operations.
  */
  export default function MachineTypeActions({ machineTypeId }: MachineTypeActionsProps) {
     const [ShowDeleteMachineType, setShowDeleteMachineType] = useState(false);
  
    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowDeleteMachineType(true);
    };
  
  
    const handleCloseDelete = () => {
      setShowDeleteMachineType(false);
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
  
  {ShowDeleteMachineType && (
    <DeleteMachineTypeDialog
      typeId={machineTypeId}
      setShowDeleteMachineType={handleCloseDelete}
    />
  )}
  
  </>
    );
  }