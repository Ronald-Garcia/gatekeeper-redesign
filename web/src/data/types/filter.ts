import { WritableAtom } from "nanostores";

export type UserFilters = "gradYear" |"budgetCodeId" | "machineTypeId";
export type BudgetFilters = "budgetTypeId";
export type MachineFilters = "MachineTypeId";
//export type FinancialFilters =

export type FilterQueries = UserFilters | MachineFilters | BudgetFilters 

export type FilterSortGeneralized= {
    label:string;
    store: WritableAtom<number | null> |WritableAtom<number[]>
    options: () => {id: number; label: string}[];
    mult?:boolean;
}
