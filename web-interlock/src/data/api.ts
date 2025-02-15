import { API_DB_URL, API_MACHINE_URL } from "@/env"
import { UserType } from "./types";

export const turnOnMachine = async (): Promise<boolean> => {
    const response = await fetch(
        `${API_MACHINE_URL}/turn-on`,
        { 
            method:"POST",
            credentials: "include" 
        }
    );
    const { message }: { message: string } = await response.json();

    if (!response.ok) {
        throw new Error(message);
    }

    return message.startsWith('s');
}

export const sendToMachine = async (message: string, data: UserType[]) => {
    const response = await fetch(
        `${API_MACHINE_URL}/demo`,
        {
            credentials: "include",
            method: "POST",
            body: JSON.stringify({
                message: message,
                data: data
            })
        }
    );

    const { m }: { m: string} = await response.json();
    if (!response.ok) {
        throw new Error(m);
    }

    return m;
}
// DEMO HELLO WORLD
export const getAllUsers = async (): Promise<{ message: string, data: UserType[]}> => {

    const response = await fetch(
        `${API_DB_URL}/users`,
        {
            credentials: "include"
        }
    )

    if (!response.ok) {
        const { message }: { message: string } = await response.json();

        throw new Error(message);
    }

    const { message, data }: {message: string, data: UserType[] }  = await response.json();

    return { message, data};
} 