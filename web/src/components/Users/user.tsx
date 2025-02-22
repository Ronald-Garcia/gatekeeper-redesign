class User {
    private name: string;
    private email:string;
    private cardNum: number; 
    private trainingList: Training[];
    //private budgetCodes: budgetCode[];
    private admin: boolean;
    private year: number;

    /* constructor for a user
     name - student's name
     email - student's
     cardNum - 
     trainingList -
     budgetCodes - 
    */
    constructor(
        name: string,
        email: string,
        cardNum: number, 
        //trainingList: Training[],
        //budgetCodes: budgetCode[],
        admin: boolean,
        year: number

    ) {
        this.name = name;
        this.email = email;
        this.cardNum = cardNum;
       // this.trainingList = trainingList;
       // this.budgetCodes = budgetCodes;
        this.admin = admin;
        this.year = year;
    }


    getName():string {
        return this.name;
    }

    getEmail():string {
        return this.email;
    }

    getCardNumber():number {
        return this.cardNum;
    }

    getYear():number {
        return this.year;
    }
}

export default function userComponent() {

    return (
        <>
        <div>
            {User.getName()}
        </div>
        </>
    )

}

