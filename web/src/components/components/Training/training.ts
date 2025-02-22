class Training {
    private machineTypes: MachineType;

    constructor(
        machineTypes:MachineType;
    ){
        this.machineTypes = machineTypes;
    }


    getMachineTypes():MachineType{
        return this.machineTypes;
    }
}