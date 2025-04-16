import { useStore } from "@nanostores/react";
import { useState, useEffect } from "react";
import Timer from "./timer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "@/components/ui/button";
import useMutationStatements from "@/hooks/use-mutation-financial-statements";
import { redirectPage } from "@nanostores/router";
import { $router } from "@/data/router";
import { $currentUser, $currentMachine, setMadeStatement, $madeStatement } from "@/data/store";
import ConfirmReportModal from "@/components/modals/ConfirmReportModal"; 
import useMutationMachineIssue from "@/hooks/use-mutation-machineIssue";

const InProgress = () => {
    // Time, in seconds, that a financial statement is updated in.
    const timeResolution = 10

    const curUser = useStore($currentUser);
    const curMachine = useStore($currentMachine);
    const { reportIssue } = useMutationMachineIssue();

    const { curBudget, createStatement, updateStatement } = useMutationStatements();
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [time, setTime] = useState<number>(0);

    const madeStatement = useStore($madeStatement);

    //If a statement hasn't been made yet or timer hit a 60 second interval.

    
    useEffect(() => {
        
        const interval = setInterval(()=> {
            setTime(time => time + 1);
        }, 1000);
        return () => {
            clearInterval(interval)
        };
    }, []);

    useEffect(() => {
        if (!madeStatement) {
            setMadeStatement(true);
            createStatement(0);
        } else if ((time % timeResolution === 0)){
            updateStatement(time);
        }

    }, [time]);

    const handleReportIssue = () => {
        setIsModalOpen(true);
    };

    const handleConfirmReport = async () => {
        setIsModalOpen(false);
      
        const result = await reportIssue(curUser.id, curMachine.id); 
      
        if (result) {
          console.log("Reported issue:", result);
        }
    };

    
    const onSubmit = async () => {
        await updateStatement(time);
        redirectPage($router, "interlockLogin")
    };
    

    return (
        <>
            <Card>
                <CardHeader>
                        <CardTitle>
                            Time spent
                        </CardTitle>
                        <CardDescription>
                            Below is the amount of time that will be billed to {curBudget.name}.
                        </CardDescription>
                    </CardHeader>
                <CardContent>
                    <div data-cy="timer" 
                        
                        className="flex justify-center text-5xl font-bold">
                        <Timer time={time}></Timer>
                    </div>
                    </CardContent>
                    <CardFooter className="relative flex items-center justify-end w-full" data-cy="submit">
                        <Button className="px-4 py-2 ml-4 text-black bg-yellow-400" variant="ghost" onClick={(e) => { 
                            e.stopPropagation();  // Prevent the click from bubbling up to the CardFooter's onClick
                            handleReportIssue(); 
                        }}> 
                            Report Issue 
                        </Button>
                        <Button className="absolute transform -translate-x-1/2 left-1/2" onClick={onSubmit}>
                            Tap when finished!
                        </Button>
                    </CardFooter>
            </Card>

            {/* Report Issue Confirmation Modal */}
            <ConfirmReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmReport}
            />
        </>
    );
}

export default InProgress;