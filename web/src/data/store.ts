import { User } from "./types/user";
import { atom, map } from "nanostores";
import { BudgetCode } from "./types/budgetCode"; 
import { MachineType } from "./types/machineType"; 


export const $users = atom<User[]>([]);
export const $codes = atom<BudgetCode[]>([]);
export const $machines = atom<MachineType[]>([]);

const defaultUser = new User(
  "test",
  "test@gmail.com",
  1,
  true,
  2020,
  "ttest01",
  -1
)

const defaultMachine = new MachineType(
  -1,
  "invalid"
)

export const $currentUser = map<User>(defaultUser);
export const $currentMachine = map<MachineType>(defaultMachine);

export function validCurrentUser() {
  return $currentUser.get() !== defaultUser;
}

export function adminCurrentUser() {
  return $currentUser.get().isAdmin();
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
  $users.set($users.get().filter((user: User) => user.getId() !== id));
}

export function addTraining(id: number) {
  $users.set($users.get().filter((user: User) => user.getId() !== id));
}

export function setUsers(userList: User[]) {
  $users.set(userList);
}

// export function banUserFlag(userId: number) {}

// //logic to update user
 export function updateUserById(updatedUser: User) {
  $users.set(
    $users.get().map((user: User) =>
      user.getId() === updatedUser.getId() ? updatedUser : user
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
    $codes.get().filter((code: BudgetCode) => code.getCode() !== codeNum),
  );
}

export function modifyBudgetCode(codeNum: number, alias:string) {
  $codes.set(
    $codes.get().filter((code: BudgetCode) => code.getCode() !== codeNum),
  );
}

export function addMachine(machine: MachineType) {
  $machines.set(
    [...$machines.get(), machine]
  )
}

const machine1 = new MachineType(1, "Mill 1");
const machine2 = new MachineType(2, "Mill 2");

export function removeMachine(machine: MachineType) {
  $machines.set(
    $machines.get().filter(m => m.getId() !== machine.getId())
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
    code.getId() === updatedCode.getId() ? updatedCode: code)
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

