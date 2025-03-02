import MachineActions from "./machine-actions";
import { Machine } from "@/data/types/machine";




export default function MachineAdmin({ machine }: { machine: Machine }) {
  return (
    <>
      <div className="relative flex flex-col justify-between items-center py-4 max-h-[15vh] text-sm text-clip hover:bg-stone-100 transition-colors border-y-2 border-solid border-stone-300 hover:border-stone-500">
        <MachineActions  machineId={machine.id}></MachineActions>
        <p>{machine.name} </p>
        <p>{} </p>
      </div>
    </>
  );
}
