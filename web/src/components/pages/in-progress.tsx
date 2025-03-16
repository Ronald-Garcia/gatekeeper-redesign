import { useState, useEffect } from "react";
import Timer from "./timer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { $currentUser, $newBudget, PAGES, setCurrentPage } from "@/lib/store";
import { useStore } from "@nanostores/react";
import { Button } from "@/components/ui/button";
import { useToast } from "../ui/use-toast";
import { addTransactionToDB, getMachineByName, lockMachine } from "@/data/api";
import { MACHINE_NAME } from "@/env";

const InProgress = () => {

    const newBudget = useStore($newBudget);

    const currentUser = useStore($currentUser);

    const [time, setTime] = useState<number>(0);
    const [machineId, setMachineId] = useState(-1);
    const [machineRate, setMachineRate] = useState(-1);
    const { toast } = useToast();
    useEffect(() => {
        const interval = setInterval(()=> {
            setTime(time => time + 1);
        }, 1000)
        return () => {
            clearInterval(interval)
        };
    }, []);
    
    useEffect(() => {
        console.log(time);
    }, [time]);
    useEffect(()=> {
        getMachineByName(MACHINE_NAME).then(m => {
            setMachineId(m.id)
            console.log(m.id);
            setMachineRate(m.rate)
        });
    }, [MACHINE_NAME])
    const onSubmit = async () => {
        try {

            
            await addTransactionToDB({
                moneySpent: Math.round(time/900) * machineRate/4,
                code: newBudget.id,
                budgetName: newBudget.alias,
                machineUsed: machineId,
                userJHED: currentUser.jhed
            });

            const data = await lockMachine();
            console.log(data);
            if (data.message.startsWith("e")) {
                throw new Error("Could not lock machine! Please see staff to turn off machine.")
            }
            
            setCurrentPage(PAGES.IP)    
            
            toast({
                title: "Session finished!",
                description: "The session was successfully finished, billing information was sent!"
            });
        } catch (err) {
            toast({
                variant: "destructive",
                description: (err as Error).message,
                title: "Uh oh! Something went wrong! 😔"
            })
        }

        setCurrentPage(PAGES.START);

    }
    return (
        <>
            <Card>
                <CardHeader>
                        <CardTitle>
                            Time spent
                        </CardTitle>
                        <CardDescription>
                            Below is the amount of time that will be billed to {newBudget.alias}.
                        </CardDescription>
                    </CardHeader>
                <CardContent>
                    <div className="flex justify-center font-bold text-5xl">
                        <Timer time={time}></Timer>
                    </div>
                    </CardContent>
                    <CardFooter 
                        className="justify-center"
                        onClick={onSubmit}>
                        <Button>
                            Tap when finished!
                        </Button>
                    </CardFooter>
            </Card>
        </>
    );
}

export default InProgress;