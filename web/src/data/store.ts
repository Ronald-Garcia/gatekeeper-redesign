import { User } from "./types/user";
import { atom, map } from "nanostores";
import { BudgetCode } from "./types/budgetCode"; 
import { Machine } from "./types/machine";
import { MachineType } from "./types/machineType";


export const $users = atom<User[]>([]);
export const $codes = atom<BudgetCode[]>([]);
export const $machines = atom<Machine[]>([]);
export const $machine_types = atom<MachineType[]>([]);
export const $budget_code_queue = atom<number[]>([]);

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


type Selected = User | BudgetCode;

export const $selected = atom<Selected | null>(null);
export function selectItem(item: Selected) {
  $selected.set(item);
}

export function clearItem() {
  $selected.set(null);
}

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
  type: { id: -1, name: "invalid"},
  hourlyRate: 0
}
export const $kiosk = atom<boolean>(false);

export function setKiosk(isKiosk: boolean) {
  $kiosk.set(isKiosk);
}

export const $currentUser = map<User>(defaultUser);
export const $currentMachine = map<Machine>(defaultMachine);

export function validCurrentUser() {
  return $currentUser.get() !== defaultUser;
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
export function addMachine(machine: Machine) {
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