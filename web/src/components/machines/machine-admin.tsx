import { useState } from "react";
import MachineActions from "./machine-actions";
import { Machine } from "@/data/types/machine";
import { selectItem } from "@/data/store";





export default function MachineAdmin({ machine }: { machine: Machine }) {


  const [isExpanded, setIsExpanded] = useState(false);
  const [isActive, setIsActive] = useState(false);

  function selectMachine() {
    if (!isActive) {
      selectItem(machine);
    }
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isActive) {
      setIsExpanded(!isExpanded);
    }
  };


  return (
    
    <div
      data-cy={`machine-${machine.id}`}
      className="relative flex flex-col transition-all border rounded-lg shadow-sm hover:bg-stone-100 border-stone-200 hover:border-stone-400"
    >    
    <div 
        className="flex items-center gap-6 p-4 cursor-pointer"
        onClick={handleToggle}
      >
        <div className="flex-1">
          <h3 className="text-base font-medium">{machine.name}</h3>
          <p className="text-sm text-gray-600">Type: {machine.machineType.name}</p>

        </div>
        <MachineActions  machineId={machine.id} activeStatus={machine.active}></MachineActions>
        </div>

        <div 
        className={`transition-all duration-200 ease-in-out ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 space-y-2 border-t border-stone-200">
          <p className="text-sm"><span className="font-medium">Hourly Rate:</span> ${machine.hourlyRate}</p>
        </div>
      </div>
    </div>
    
  );

  //         onClick={handleToggle}

}
