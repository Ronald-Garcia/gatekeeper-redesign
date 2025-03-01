import { useStore } from "@nanostores/react";
import { $machines } from "@/data/store";
import MachineSelect from "./machine";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import useMutationMachines from "@/hooks/use-mutation-machines";

export default function Machines() {
  const machineList = useStore($machines);
  const { makeKiosk } = useMutationMachines();
  const handleKiosk = async () => {
    await makeKiosk();
  }

  return (
    <ScrollArea>

        <div className="max-h-[20vh]">
        {machineList.length === 0 ? (
        <Button onClick={handleKiosk} className="text-xl text-wrap h-fit">No machines found, make this the Kiosk? (Make sure this has access to a keyboard!)</Button>
      ) : (
        machineList.map((machine) => (
          <MachineSelect key={machine.id} machine={machine} />
        ))
      )}

        </div>
    </ScrollArea>
  );
}
