
export type userStats = {
    dateAdded: Date;
    totalTime: number;
}
export type userBudgetStats = {
    budgetCode: number,
    data: userStats[]
}
export type userMachinesStats = {
    machineId: number,
    data: userStats[]
}