export type BudgetCode = {
    id: number;
    code: string;
    name: string;
    active: number;
}


export type UserBudgetCodeRelation = {
    id: number;
    budgetCodeId: string;
    userId: string;
}