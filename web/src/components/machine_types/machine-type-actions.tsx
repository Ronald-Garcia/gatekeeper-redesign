import { useStore } from "@nanostores/react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import useQueryMachines from "@/hooks/use-query-machines";
import MachineTypeComponent from "./machine_type";
import { $machine_types } from "@/data/store";


export default function MachinesComponent() {

  const machineTypeList = useStore($machine_types);

  return (
    <ScrollArea>

        <div className="max-h-[20vh]">
        {machineTypeList.length === 0 ? (
        <p> No machines found. Please add some!  </p>
      ) : (
        machineTypeList.map((m) => (
          <MachineTypeComponent key={m.id} type={m}/>
        ))
      )}

        </div>
    </ScrollArea>
  );
}

