import { User } from "./types/user";
import { atom, map } from "nanostores";
import { BudgetCode } from "./types/budgetCode"; 
import { Machine } from "./types/machine";
import { MachineType } from "./types/machineType";
import { financialStatement } from "./types/financialStatement";
import { logger } from "@nanostores/logger"
import { DateRange } from "react-day-picker";

export const $users = atom<User[]>([]);
export const $codes = atom<BudgetCode[]>([]);
export const $machines = atom<Machine[]>([]);
export const $machine_types = atom<MachineType[]>([]);
export const $budget_code_queue = atom<number[]>([]);
export const $training_queue = atom<number[]>([]);
export const $date_range = atom<DateRange | undefined>(undefined);
export const $date = atom<Date | undefined>(undefined);
export const $hasMoreUserBudgets = atom<boolean>(false);
export const $hasMoreUserTrainings = atom<boolean>(false);
export const $currentPage = atom<number>(1);

export function setPage(p: number) {
  $currentPage.set(p);
}

export function incrementPage() {
  $currentPage.set($currentPage.get() + 1);
}

export function decrementPage() {
  $currentPage.set($currentPage.get() - 1);
}

export function setHasMoreUserBudgets(hasMore: boolean) {
  $hasMoreUserBudgets.set(hasMore);
}

export function setHasMoreUserTrainings(hasMore: boolean) {
  $hasMoreUserTrainings.set(hasMore);
}


export function setDate(date: Date | undefined) {
  $date.set(date);
}

export function resetDate() {
  $date.set(undefined);
}

export function setDateRange(dateRange: DateRange | undefined) {
  $date_range.set(dateRange);
}

export function resetDateRange() {
  $date_range.set(undefined);
}

export function setBudgetCodeQueue(bcs: number[]) {
  $budget_code_queue.set(bcs);
}

export function addBudgetCodeQueue(bc: number) {
  $budget_code_queue.set([...$budget_code_queue.get(), bc]);
}

export function removeBudgetCodeQueue(bc: number) {
  $budget_code_queue.set($budget_code_queue.get().filter(b => b !== bc));
}

export function clearBudgetCodeQueue() {
  $budget_code_queue.set([]);
}

export function toggleBudgetCodeQueue(bc: number) {
  const bcs =  $budget_code_queue.get();
  const hasBc = bcs.some(b => b === bc);
  if (hasBc) {
    removeBudgetCodeQueue(bc);
  } else {
    addBudgetCodeQueue(bc);
  }
}


export function setTrainingQueue(bcs: number[]) {
  $training_queue.set(bcs);
}

export function addTrainingQueue(bc: number) {
  $training_queue.set([...$training_queue.get(), bc]);
}



export function removeTrainingQueue(bc: number) {
  $training_queue.set($training_queue.get().filter(b => b !== bc));
}

export function clearTrainingQueue() {
  $training_queue.set([]);
}

export function toggleMachineTypeQueue(bc: number) {
  clearTrainingQueue();
  const bcs =  $training_queue.get();
  const hasBc = bcs.some(b => b === bc);
  if (hasBc) {
    removeTrainingQueue(bc);
  } else {
    addTrainingQueue(bc);
  }
}

export function toggleTrainingQueue(bc: number) {
  const bcs =  $training_queue.get();
  const hasBc = bcs.some(b => b === bc);
  if (hasBc) {
    removeTrainingQueue(bc);
  } else {
    addTrainingQueue(bc);
  }
}
export const $statements = atom<financialStatement[]>([]);





// export function addSelectedBudgetCode(bc: number) {
//   $budget_code_queue.set([...$budget_code_queue.get(), bc ]);
// }

// export function removeSelectedBudgetCode(bc: number) {
//   $budget_code_queue.set($budget_code_queue.get().filter(b => b !== bc));
// }

// export function clearSelectedBudgetCode() {
//   $budget_code_queue.set([]);
// }

// export function toggleSelectedBudgetCode(bc: number) {
//   const sbc = $budget_code_queue.get().find(b => b === bc);

//   if (sbc) {
//     removeSelectedBudgetCode(bc);
//   } else {
//     addSelectedBudgetCode(bc);
//   }
// }

// export function setSelectedBudgetCode(bcs: number[]) {
//   $budget_code_queue.set(bcs);
// }

const defaultUser: User = {
  name: "test",
  cardNum: "-1",
  isAdmin: 0,
  graduationYear: 2020,
  JHED: "ttest01",
  id: -1
}

const defaultMachine: Machine = {
  id: -1,
  name: "invalid",
  machineType: {
    id: -1,
    name: ""
  },
  hourlyRate: 0,
  active:-1,
}

const defaultBudget: BudgetCode = {
  id: -1, 
  name: "invalid",
  code: "invalid"
}

export const $kiosk = atom<boolean>(false);

export function setKiosk(isKiosk: boolean) {
  $kiosk.set(isKiosk);
}

export const $currentUser = map<User>(defaultUser);
export const $currentMachine = map<Machine>(defaultMachine);
export const $currentBudget = map<BudgetCode>(defaultBudget);

export function validCurrentUser() {
  return $currentUser.get() !== defaultUser;
}

export function validCurrentBudget() {
  return $currentBudget.get() !== defaultBudget;
}

export function setCurrentBudget(budget: BudgetCode) {
  $currentBudget.set(budget);
}

export function clearCurrentBudget() {
  $currentBudget.set(defaultBudget)
}

export function adminCurrentUser() {
  return $currentUser.get().isAdmin;
}


export function setCurrentUser(user: User) {
  $currentUser.set(user);
}


export function clearCurrentUser() {
  $currentUser.set(defaultUser);
}


export function addUser(user: User) {
  $users.set([...$users.get(), user]);
}

export function deleteUserById(id: number) {
  $users.set($users.get().filter((user: User) => user.id !== id));
}

export function addTraining(id: number) {
  $users.set($users.get().filter((user: User) => user.id !== id));
}

export function setUsers(userList: User[]) {
  $users.set(userList);
}


// //logic to update user
export function updateUserById(updatedUser: User) {
  $users.set(
    $users.get().map((user: User) =>
      user.id === updatedUser.id ? updatedUser : user
    )
  );
 }



//machine state funcitons 


export function validCurrentMachine() {
  return $currentMachine.get() !== defaultMachine || $kiosk.get();
}

export function setCurrentMachine(machine: Machine) {
  $currentMachine.set(machine);
}


export function clearCurrentMachine() {
  $currentMachine.set(defaultMachine);
}



 //budget code store functions 
export function setBudgetCodes(codeList: BudgetCode[]) {
  $codes.set(codeList);
}

export function appendBudgetCodes(codeList: BudgetCode[]) {
  $codes.set([...$codes.get(), ...codeList]);
}

export function addBudgetCode(code: BudgetCode) {
  $codes.set([...$codes.get(), code]);
}

export function deleteBudgetCodeById(id: number) {
  $codes.set(
    $codes.get().filter((code: BudgetCode) => code.id !== id)
  );
}

export function deleteBudgetCodeByNum(codeNum: string) {
  $codes.set(
    $codes.get().filter((code: BudgetCode) => code.code !== codeNum),
  );
}



//machine store functions 
export function appendMachine(machine: Machine) {
  $machines.set(
    [...$machines.get(), machine]
  )
}

export function removeMachine(id: number) {
  $machines.set(
    $machines.get().filter(m => m.id !== id)
  );
}

export function setMachines(machines: Machine[]) {
  $machines.set(machines);
}

export function clearMachines() {
  $machines.set([]);
}


//machine type functions 

export function addNewMachineType(type: MachineType) {
  $machine_types.set([...$machine_types.get(), type]);
}

export function deleteOldMachineType(id: number) {
  $machine_types.set(
    $machine_types.get().filter(m => m.id !== id)
  );
}

export function setMachinesTypes(typeList: MachineType[]) {
  $machine_types.set(typeList);
}

export function appendMachineTypes(typeList: MachineType[]) {
  $machine_types.set([...$machine_types.get(), ...typeList]);
}

// *** SERACH STORES ***

//The "local" search for a user, aka state control of the search bar.
export const $localSearch = atom<string>("")
export function setLocalSearch(newLocalSearch: string) {
  $localSearch.set(newLocalSearch)
}

// The active search for a user, budget code, machine, etc entered into the main search bar.
export const $activeSearch = atom<string>("")
export function setActiveSearch(newSearch: string) {
  $activeSearch.set(newSearch)
}

// Reset both the search bar and active search.
export function resetSearch() {
  $localSearch.set("")
  $activeSearch.set("")
}

export function setFinancialStatements(statements: financialStatement[]) {
  $statements.set(statements);
}

logger({ $budget_code_queue })
export const $curbudgets = atom<BudgetCode[]>([])
export function setCurBudgets(newBudgetCodes: BudgetCode[]) {
  $curbudgets.set(newBudgetCodes)
}

export const $curtrainings = atom<MachineType[]>([])
export function setCurTrainings(newTrainings: MachineType[]) {
  $curtrainings.set(newTrainings)
}

export const $dashboardActiveSearch = atom("");
export function setDashboardActiveSearch(search: string) {
  $dashboardActiveSearch.set(search);
}

export const $dashboardLocalSearch = atom("");
export function setDashboardLocalSearch(search: string) {
  $dashboardLocalSearch.set(search);
}

export function resetDashboardSearch() {
  setDashboardActiveSearch("");
  setDashboardLocalSearch("");
}
