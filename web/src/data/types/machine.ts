import { MachineType } from "./machineType";

export type Machine = {
    id: number;
    name: string;
    machineType: MachineType,
    hourlyRate: number;
    active: number;
    lastTimeUsed:string;
}