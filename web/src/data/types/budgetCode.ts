export type BudgetCode = {
    id: number;
    code: string;
    name: string;
    type: budgetCodeType;
    active: number;
}


export type UserBudgetCodeRelation = {
    id: number;
    budgetCodeId: string;
    userId: string;
}

export type budgetCodeType = {
    id: number; 
    name: string;
}