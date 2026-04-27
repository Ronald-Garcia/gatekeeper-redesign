import React, { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import useMutationMachines from "@/hooks/use-mutation-machines";
import useQueryMachines from "@/hooks/use-query-machines";
import { $machine_types, $training_queue, toggleMachineTypeQueue } from "@/data/store";
import { useStore } from "@nanostores/react";
import { ScrollArea } from "../ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Machine } from "@/data/types/machine";

 
// function that handles state of the dialogue, error handling from api
const EditMachineDialog = ({ machine, setOpen }: { machine: Machine, setOpen: React.Dispatch<React.SetStateAction<boolean>>; }) => {
    const machineQueue = useStore($training_queue);
    const { modifyMachine } = useMutationMachines();
    const { loadMachines } = useQueryMachines(false);
    
    useQueryMachines(true);
    
    // Default state of active is 1 = on.
    const [name, setMachineName] = useState(machine.name);
    const [hourlyRate, setHourlyRate] = useState(`${machine.hourlyRate}`);


    const typesList = useStore($machine_types);
    

    const [errors, setErrors] = useState({
        name: false,
        machineTypeId: false,
        hourlyRate: false
    });

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
            return;
        }

        await modifyMachine(name, machineQueue[0] , parseInt(hourlyRate), machine.id, machine.active); //use hooks to handle state of training
        setOpen(false);
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Machine "{machine.name}"</DialogTitle>
          </DialogHeader>
          <Label htmlFor="content" className="text-sm">
            Please fill out form with machine:
          </Label>
          <div className="space-y-4">
            <Input
              onChange={handleOnChangeName}
              placeholder="Enter Machine Name"
              data-cy="enter-machine-name"
              defaultValue={machine.name}
              className={errors.name ? "border-red-500" : ""}
            >
            </Input>
          </div>
          
          <div className="space-y-4">
          <ScrollArea>
                <ToggleGroup type="single" className="flex-col w-full">
                {typesList.map((type) => (
                  <ToggleGroupItem
                    data-cy = {type.name}
                    key={type.id}
                    value={type.id.toString()}
                    onClick={() => handleClickOnMachineId(type.id)}
                    className={`flex items-center justify-center h-12 w-full text-sm transition-colors border-y border-solid border-stone-200 hover:bg-stone-50 hover:border-stone-300 cursor-pointer rounded-md ${
                      machineQueue.includes(type.id) ?
                      "bg-stone-100 border-stone-300" :
                      "bg-white"
                    }`}
                    data-state={machineQueue.includes(type.id) ? "on" : "off"}
                    aria-pressed={machineQueue.includes(type.id)}
                  >
                    <p className="text-center font-medium">{type.name}</p>
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
              defaultValue={machine.hourlyRate}
              className={errors.hourlyRate ? "border-red-500" : ""}
            >
            </Input>
          </div>

          <DialogFooter>
            <Button className="jhu-white-button" variant={"ghost"} data-cy="machine-add-cancel" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="jhu-blue-button" variant={"ghost"} data-cy="machine-add-confirm" onClick={handleAddMachine}>Save Changes</Button>

          </DialogFooter>
        </DialogContent>
    </div>
  );
};

export default EditMachineDialog;
