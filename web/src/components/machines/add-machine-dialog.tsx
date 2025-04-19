import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import useMutationMachines from "@/hooks/use-mutation-machines";
import useQueryMachines from "@/hooks/use-query-machines";
import { $machine_types, $training_queue, clearTrainingQueue, toggleMachineTypeQueue } from "@/data/store";
import { useStore } from "@nanostores/react";
import { ScrollArea } from "../ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

 
// function that handles state of the dialogue, error handling from api
const AddMachineDialog = () => {
    const machineQueue = useStore($training_queue);
    const { addMachine } = useMutationMachines();
    const { loadMachines } = useQueryMachines(false);
    
    useQueryMachines(true);
    
    // Default state of active is 1 = on.
    const [name, setMachineName] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");


    const typesList = useStore($machine_types);
    

    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({
        name: false,
        machineTypeId: false,
        hourlyRate: false
    });

    const handleOpenClose = () => {
        setOpen(!open);
        // Reset errors when dialog closes
        setErrors({
        name: false,
        machineTypeId: false, 
        hourlyRate: false
        });
        clearTrainingQueue();
    }

    const validateFields = () => {
        const newErrors = {
        name: name.trim() === "",
        machineTypeId: machineQueue.length !== 1 , //If no name for machine type, error
        hourlyRate: hourlyRate.trim() === "" || isNaN(parseInt(hourlyRate))
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    //async function with editing logic, including error handling
    const handleAddMachine = async () => {
        if (!validateFields()) {
            console.log("nope");
            return;
        }

        const response = await addMachine(name, machineQueue[0] , parseInt(hourlyRate), 1 ); //use hooks to handle state of training
        
        setOpen(false);
        if (response) {
        //TODO error handling.
        }
        loadMachines();
    };

    const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMachineName(e.target.value);
        setErrors(prev => ({...prev, name: false}));
    }

    const handleClickOnMachineId = (machineTypeId:number) => {
        toggleMachineTypeQueue(machineTypeId);
        setErrors(prev => ({...prev, machineTypeId: false}));
    }


    const handleOnChangeRate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHourlyRate(e.target.value);
        setErrors(prev => ({...prev, hourlyRate: false}));
    }

  return (
    <div data-cy="user-dialog">
      <Dialog open={open} onOpenChange={handleOpenClose}>
        <DialogTrigger asChild>
          <Button data-cy="add-machine-button" className="jhu-blue-button add-button h-[40px]" variant={"ghost"} size="default">
            Add Machine
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Machine</DialogTitle>
          </DialogHeader>
          <Label htmlFor="content" className="text-sm">
            Please fill out form with new Machine Information:
          </Label>
          <div className="space-y-4">
            <Input
              onChange={handleOnChangeName}
              placeholder="Enter Machine Name"
              data-cy="enter-machine-name"
              className={errors.name ? "border-red-500" : ""}
            >
            </Input>
          </div>
          
          <div className="space-y-4">
          <ScrollArea>
        <ToggleGroup type="single" className="flex-col">
              {typesList.map((type) => (
                <ToggleGroupItem
                  data-cy= {`machine-${type.name}`}
                  key={type.id}
                  value={type.id.toString()}
                  onClick={() => handleClickOnMachineId(type.id)}
                  className={
                    errors.machineTypeId ? 
                    ` toggle-error-button 
                    ${
                    machineQueue.some(b => b === type.id) ?
                    "data-[state=on]" :
                    "data-[state=off]"
                    }` 
                    : 
                    ` toggle-group-button    
                    ${
                    machineQueue.some(b => b === type.id) ?
                    "data-[state=on]" :
                    "data-[state=off]"
                  }` 
                }
                  data-state={machineQueue.some(b=> b===type.id) ? "on" : "off"}
                  aria-pressed={machineQueue.some(b=> b===type.id)}
                >
                  <p>{type.name}</p>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </ScrollArea>  
        </div>

          <div className="Enter Hourly Rate">
            <Input
              onChange={handleOnChangeRate}
              placeholder="Hourly Rate"
              data-cy="enter-hourly-rate"
              className={errors.hourlyRate ? "border-red-500" : ""}
            >
            </Input>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button className="jhu-white-button" variant={"ghost"} data-cy="machine-add-cancel">Cancel</Button>
            </DialogClose>

            <Button className="jhu-blue-button" variant={"ghost"} data-cy="machine-add-confirm" onClick={handleAddMachine}>Save Changes</Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddMachineDialog;
