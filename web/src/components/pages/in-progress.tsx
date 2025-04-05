import { useState, useEffect } from "react";
import Timer from "./timer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "@/components/ui/button";
import useMutationStatements from "@/hooks/use-mutation-financial-statements";
import { openPage } from "@nanostores/router";
import { $router } from "@/data/router";
import ConfirmReportModal from "@/components/modals/ConfirmReportModal"; 

const InProgress = () => {

    const { curBudget, createStatement } = useMutationStatements();
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [time, setTime] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(()=> {
            setTime(time => time + 1);
        }, 1000)
        return () => {
            clearInterval(interval)
        };
    }, []);

    const handleReportIssue = () => {
        setIsModalOpen(true);
    };

    const handleConfirmReport = () => {
        setIsModalOpen(false);
        console.log("Reported maintenance issue for this machine!");
        // TODO: Implement API call to report the issue
    };

    
    const onSubmit = async () => {
        await createStatement(time);
        openPage($router, "start_page")
    }
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
                        
                        className="flex justify-center font-bold text-5xl">
                        <Timer time={time}></Timer>
                    </div>
                    </CardContent>
                    <CardFooter className="relative flex justify-end items-center w-full" data-cy="submit">
                        <Button className="bg-yellow-400 text-black px-4 py-2 ml-4" variant="ghost" onClick={(e) => { 
                            e.stopPropagation();  // Prevent the click from bubbling up to the CardFooter's onClick
                            handleReportIssue(); 
                        }}> 
                            Report Issue 
                        </Button>
                        <Button className="absolute left-1/2 transform -translate-x-1/2" onClick={onSubmit}>
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