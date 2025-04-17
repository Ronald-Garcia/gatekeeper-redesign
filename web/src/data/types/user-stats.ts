export type userStats = {
    id:number,
    user: {
        name: string;
        JHED: string;
    };
    budgetCode: {
        name: string;
        code: string;
    };
    machine: {
        name: string;
        hourlyRate: number;
    };
    dateAdded: string;
    timeSpent: number;
}