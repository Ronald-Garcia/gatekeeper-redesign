import { API_MACHINE_URL } from "@/env"

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