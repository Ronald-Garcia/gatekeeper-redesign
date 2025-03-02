import { User } from "./types/user";
import { atom, map } from "nanostores";
import { BudgetCode } from "./types/budgetCode"; 
import { Machine } from "./types/machine";
import { MachineType } from "./types/machineType";


export const $users = atom<User[]>([]);
export const $codes = atom<BudgetCode[]>([]);
export const $machines = atom<Machine[]>([]);
export const $machine_types = atom<MachineType[]>([]);

const defaultUser: User = {
  name: "test",
  cardNum: "-1",
  lastDigitOfCardNum: -1,
  isAdmin: 0,
  graduationYear: 2020,
  JHED: "ttest01",
  id: -1
}

const defaultMachine: Machine = {
  id: -1,
  name: "invalid",
  type: { id: -1, type: "invalid"},
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
    $codes.get().filter((code: BudgetCode) => code.budgetCode !== codeNum),
  );
}


export function updateABudgetCode(updatedCode:BudgetCode) {
  $codes.set(
    $codes.get().map((code: BudgetCode) => 
    code.id === updatedCode.id ? updatedCode: code)
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

