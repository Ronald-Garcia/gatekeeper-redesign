import MachineSelectDialog from "./machine-select";
import { Machine } from "@/data/types/machine";

export default function MachineSelect({ machine }: { machine: Machine }) {
  return (
    <div data-cy={`machine-${machine.id}`} className="relative">
      <div className="relative flex flex-col p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">{machine.name}</h3>
          </div>
          <MachineSelectDialog machine={machine} />
        </div>
      </div>
    </div>
  );
}
