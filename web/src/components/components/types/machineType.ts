export class MachineType {
    private id: number;
    private name: string;

    constructor(
      name: string,
      id: number
    ) {
      this.name = name;
      this.id = id;
    }
  
    getName(): string {
      return this.name;
    }  
    getId(): number {
      return this.id;
    }



    
}
