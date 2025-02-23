import { User } from "@/components/components/types/user";
import { atom } from "nanostores";
import { BudgetCode } from "@/components/components/types/budgetCode";

export const $users = atom<User[]>([]);
export const $codes = atom<BudgetCode[]>([]);

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

export function banUserFlag(userId: number) {}

//logic to update user
export function updateUserById(userId: number) {
  return User;
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
