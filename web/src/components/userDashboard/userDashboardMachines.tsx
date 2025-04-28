import { useStore } from "@nanostores/react";
import { $machines } from "@/data/store";
import useQueryMachines from "@/hooks/use-query-machines";
import MachineUserDashboard from "./machineUserDashboard";

export default function UserMachinesComponent() {
  useQueryMachines(true);

  const machineList = useStore($machines);

  return (
        <div className="max-h-[20vh] p-4" data-cy="machine-user">
        {machineList.length === 0 ? (
        <p> No machines found. Please add some!  </p>
      ) : 
      <div className="space-y-4">

        {machineList.map((m) => (
          <MachineUserDashboard key={m.id} machine={m} dateLastReload={new Date()}/>
        ))}
        </div>
      }
        </div>
  );
}
