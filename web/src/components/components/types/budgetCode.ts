export class budgetCode {

    private code;
    private amountOwed;

    constructor(
        code:string, 
        amountOwed:number
    ){
        this.code = code;
        this.amountOwed = amountOwed;

    }

    getCode(): string {
        return this.code;
      }

    getAmountOwed(): number {
        return this.amountOwed;
    }


}
