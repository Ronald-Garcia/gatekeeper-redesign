export type BudgetCode = {
    id: number;
    code: string;
    name: string;
    type: budgetCodeType;
}


export type UserBudgetCodeRelation = {
    id: number;
    budgetCodeId: string;
    userId: string;
}

export type budgetCodeType = {
    id: number; 
    type : string;
}