import { MachineType } from "./machineType";

export type Machine = {
    id: number;
    name: string;
    type: MachineType,
    hourlyRate: number;
    active: number;
}