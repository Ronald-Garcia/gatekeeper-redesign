import { useStore } from "@nanostores/react";
import { $machines } from "@/data/store";
import MachineSelect from "./machine";
import { ScrollArea } from "../ui/scroll-area";

export default function Machines() {
  const machineList = useStore($machines);

  return (
    <ScrollArea>

        <div className="max-h-[20vh]">
        {machineList.length === 0 ? (
        <p> No machines found. Please add some!  </p>
      ) : (
        machineList.map((machine) => (
          <MachineSelect key={machine.id} machine={machine} />
        ))
      )}

        </div>
    </ScrollArea>
  );
}
