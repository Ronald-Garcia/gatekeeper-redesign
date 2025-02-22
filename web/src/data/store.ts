import { User } from "@/components/components/types/user"
import {Training} from 
import { atom } from "nanostores";


export const users = atom<User[]> ([]);

export function addUser(user:User) {
    users.set([...users.get(), user]);
}

export function deleteUser(cardNum:number) {
    users.set(users.get().filter((user:User) => user.getCardNumber() !== cardNum));
}

export function addTraining(cardNum:number), training: Training {
    users.set(users.get().filter((user:User) => user.getCardNumber() !== cardNum));
}







