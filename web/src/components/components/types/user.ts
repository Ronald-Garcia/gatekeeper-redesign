export class User {
  private id: number;
  private name: string;
  private email: string;
  private cardNum: number;
  private admin: boolean;
  private year: number;
  private jhed: string;

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
    admin: boolean,
    year: number,
    jhed: string,
    id: number
  ) {
    this.name = name;
    this.email = email;
    this.cardNum = cardNum;
    this.admin = admin;
    this.year = year;
    this.jhed = jhed;
    this.id = id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getCardNumber(): number {
    return this.cardNum;
  }

  getYear(): number {
    return this.year;
  }

  isAdmin(): boolean {
    return this.admin;
  }

  getJHED(): string {
    return this.jhed;
  }

  getId(): number {
    return this.id;
  }
}
