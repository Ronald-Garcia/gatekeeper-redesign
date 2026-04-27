
export type userStats = {
    dateAdded: Date;
    totalTime: number;
}
export type userBudgetStats = {
    budgetCode: string,
    data: userStats[]
}
export type userMachinesStats = {
    machineType: string,
    data: userStats[]
}