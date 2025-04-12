import { useStore } from "@nanostores/react";
import { $machines } from "@/data/store";
import useQueryMachines from "@/hooks/use-query-machines";
import MachineAdmin from "../machines/machine-admin";

export default function UserMachinesComponent() {
  useQueryMachines(true);

  const machineList = useStore($machines);

  return (
        <div className="max-h-[20vh] p-4">
        {machineList.length === 0 ? (
        <p> No machines found. Please add some!  </p>
      ) : 
      <div className="space-y-4">

        {machineList.map((m) => (
          <MachineAdmin key={m.id} machine={m}/>
        ))}
        </div>
      }
        </div>
  );
}
