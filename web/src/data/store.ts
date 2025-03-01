import { User } from "./types/user";
import { atom, map } from "nanostores";
import { BudgetCode } from "./types/budgetCode"; 
import { MachineType } from "./types/machineType"; 


export const $users = atom<User[]>([]);
export const $codes = atom<BudgetCode[]>([]);
export const $machines = atom<MachineType[]>([]);

const defaultUser: User = {
  name: "test",
  cardNum: "-1",
  lastDigitOfCardNum: -1,
  isAdmin: 0,
  graduationYear: 2020,
  JHED: "ttest01",
  id: -1
}

const defaultMachine: MachineType = {
  id: -1,
  name: "invalid"
}

export const $currentUser = map<User>(defaultUser);
export const $currentMachine = map<MachineType>(defaultMachine);

export function validCurrentUser() {
  return $currentUser.get() !== defaultUser;
}

export function adminCurrentUser() {
  return $currentUser.get().isAdmin;
}


export function validCurrentMachine() {
  return $currentMachine.get() !== defaultMachine;
}

export function setCurrentUser(user: User) {
  $currentUser.set(user);
}

export function setCurrentMachine(machine: MachineType) {
  $currentMachine.set(machine);
}

export function clearCurrentUser() {
  $currentUser.set(defaultUser);
}

export function clearCurrentMachine() {
  $currentMachine.set(defaultMachine);
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

// export function banUserFlag(userId: number) {}

// //logic to update user
 export function updateUserById(updatedUser: User) {
  $users.set(
    $users.get().map((user: User) =>
      user.id === updatedUser.id ? updatedUser : user
    )
  );
 }

export function setBudgetCodes(codeList: BudgetCode[]) {
  $codes.set(codeList);
}

export function addBudgetCode(code: BudgetCode) {
  $codes.set([...$codes.get(), code]);
}

export function deleteBudgetCodeByNum(codeNum: number) {
  $codes.set(
    $codes.get().filter((code: BudgetCode) => code.code !== codeNum),
  );
}

export function modifyBudgetCode(codeNum: number, alias:string) {
  $codes.set(
    $codes.get().filter((code: BudgetCode) => code.code !== codeNum),
  );
}

export function addMachine(machine: MachineType) {
  $machines.set(
    [...$machines.get(), machine]
  )
}

const machine1: MachineType = {id: 1, name: "Mill 1"};
const machine2: MachineType = {id: 2, name: "Mill 2"};

export function removeMachine(machine: MachineType) {
  $machines.set(
    $machines.get().filter(m => m.id !== machine.id)
  );
}

export function setMachines(machines: MachineType[]) {
  $machines.set(machines);
}

export function clearMachines() {
  $machines.set([]);
}

export function updateABudgetCode(updatedCode:BudgetCode) {
  $codes.set(
    $codes.get().map((code: BudgetCode) => 
    code.id === updatedCode.id ? updatedCode: code)
  );
}

addMachine(machine1);
addMachine(machine2);
addMachine(machine2);
addMachine(machine2);
addMachine(machine2);
addMachine(machine2);
addMachine(machine2);
addMachine(machine2);
addMachine(machine2);
addMachine(machine2);
addMachine(machine2);
addMachine(machine2);
addMachine(machine2);
addMachine(machine2);
addMachine(machine2);
addMachine(machine2);

addUser(defaultUser);
addUser(defaultUser);
addUser(defaultUser);
addUser(defaultUser);
addUser(defaultUser);
addUser(defaultUser);
addUser(defaultUser);
addUser(defaultUser);
addUser(defaultUser);
addUser(defaultUser);
addUser(defaultUser);
addUser(defaultUser);
addUser(defaultUser);
addUser(defaultUser);

