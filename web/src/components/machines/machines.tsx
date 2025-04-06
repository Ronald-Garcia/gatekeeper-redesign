import { useStore } from "@nanostores/react";
import { $machines, validCurrentMachine } from "@/data/store";
import MachineSelect from "./machine";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import useMutationMachines from "@/hooks/use-mutation-machines";
import { redirectPage } from "@nanostores/router";
import { $router } from "@/data/router";

export default function MachinesSelect() {
  const machineList = useStore($machines);
  const { makeKiosk } = useMutationMachines();
  const handleKiosk = async () => {
    await makeKiosk();

    if (validCurrentMachine()) {
      redirectPage($router, "users");
    } 
  }

  return (
    <ScrollArea>

    <div className="max-h-[35vh] p-4">
      {machineList.length === 0 ? (
        <Button onClick={handleKiosk} className="text-xl text-wrap h-fit">
          No machines found, make this the Kiosk? (Make sure this has access to a keyboard!)
        </Button>
      ) : (
        <div className="space-y-4">
          {machineList.map((machine) => (
            <MachineSelect key={machine.id} machine={machine} />
          ))}
        </div>
      )}
    </div>
    </ScrollArea>

  );
}
