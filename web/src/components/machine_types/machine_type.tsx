import { MachineType } from "@/data/types/machineType";
import MachineTypeActions from "./machine_type-actions";

/*
Machine type component
@param type: MachineType, just to access info to display the machine type information on the machineTypes component. 
*/
export default function MachineTypeComponent({ type }: { type: MachineType }) {
  return (
    <>
      <div className="relative flex flex-col justify-between items-center py-4 max-h-[15vh] text-sm text-clip hover:bg-stone-100 transition-colors border-y-2 border-solid border-stone-300 hover:border-stone-500">
        <MachineTypeActions machineTypeId={type.id}></MachineTypeActions>
        <p>{type.type} </p>
      </div>
    </>
  );
}
