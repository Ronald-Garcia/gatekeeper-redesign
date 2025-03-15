export type BudgetCode = {
    id: number;
    code: string;
    name: string;
}


export type UserBudgetCodeRelation = {
    id: number;
    budgetCodeId: string;
    userId: string;
}