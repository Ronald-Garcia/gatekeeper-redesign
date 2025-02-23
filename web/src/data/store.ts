import { User } from "@/components/components/types/user"
import { atom } from "nanostores";
import { budgetCode } from "@/components/components/types/budgetCode";


export const users = atom<User[]> ([]);
export const codes = atom<budgetCode[]> ([]);

export function addUser(user:User) {
    users.set([...users.get(), user]);
}

export function deleteUser(cardNum:number) {
    users.set(users.get().filter((user:User) => user.getCardNumber() !== cardNum));
}

export function addTraining(cardNum:number) {
    users.set(users.get().filter((user:User) => user.getCardNumber() !== cardNum));
}

export function setUsers(userList: User[]) {
    users.set(userList);
}

export function setBudgetCodes(codeList:budgetCode[]){
    codes.set(codeList);
}

export function addBudgetCode(code:budgetCode) {
    codes.set([...codes.get(), code]);
}

export function deleteBudgetCode(codeNum:string) {
    codes.set(codes.get().filter((code:budgetCode) => code.getCode() !== codeNum));
}
