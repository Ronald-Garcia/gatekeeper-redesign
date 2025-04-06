import MachineActions from "./machine-actions";
import { Machine } from "@/data/types/machine";
import ToggleableItem from "../Users/toggleable-item";

export default function MachineAdmin({ machine }: { machine: Machine }) {
  return (
    <ToggleableItem
      title={machine.name}
      subtitle={`Type: ${machine.machineType.name}`}
      details={[
        { label: "Hourly Rate", value: `$${machine.hourlyRate}` },
        { label: "Status", value: machine.active === 1 ? "Active" : "Inactive" }
      ]}
      actions={
        <MachineActions 
          machine={machine}
        />
      }
      dataCy={`machine-${machine.id}`}
    />
  );
}
