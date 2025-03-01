export class BudgetCode {

    private id: number;
    private code: number
    private alias: string;

    constructor(
        code: number, 
        id: number,
        alias: string
    ){
        this.code = code;
        this.id = id;
        this.alias = alias;
    }

    getCode(): number {
        return this.code;
    }

    getId(): number {
        return this.id;
    }

    getAlias(): string {
        return this.alias;
    }

}
