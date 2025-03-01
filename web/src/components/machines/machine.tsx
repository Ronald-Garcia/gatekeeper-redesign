import { MachineType } from "@/data/types/machineType";
import MachineSelectDialog from "./machine-select";




export default function MachineSelect({ machine }: { machine: MachineType }) {
  return (
    <>
    
      <div
      className="flex flex-col justify-between items-center py-4 max-h-[15vh] text-sm text-clip hover:bg-stone-100 transition-colors border-y-2 border-solid border-stone-300 hover:border-stone-500"
    >
      <div className="flex w-full justify-between px-2">
        <div className=" truncate">
          {machine.getName()}
        </div>

        <MachineSelectDialog machine={machine}></MachineSelectDialog>
      </div>

    </div>
    </>
  );
}
