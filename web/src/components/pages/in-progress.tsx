import { useStore } from "@nanostores/react";
import { useState, useEffect } from "react";
import Timer from "./timer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "@/components/ui/button";
import useMutationStatements from "@/hooks/use-mutation-financial-statements";
import { redirectPage } from "@nanostores/router";
import { $router } from "@/data/router";
import { $currentUser } from "@/data/store";
import ReportFormModal from "@/components/modals/ReportFormModal"; 
import useMutationMachines from "@/hooks/use-mutation-machines";

const InProgress = () => {
    // Time, in seconds, that a financial statement is updated in.
    const timeResolution = 450; // Update every 7 and a half minutes.

    const curUser = useStore($currentUser);

    const { curBudget, createStatement, updateStatement } = useMutationStatements();
    const {curMachine, modifyMachine} = useMutationMachines();
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);


    const [time, setTime] = useState<number>(0);

    const [madeStatement, setMadeStatement] = useState(false);

    //If a statement hasn't been made yet or timer hit a 60 second interval.

    
    useEffect(() => {
        
        const interval = setInterval(()=> {
            setTime(time => time + 1);
        }, 1000);
        return () => {
            clearInterval(interval)
        };
    }, []);

    const handleCreation = async () => {
        await createStatement(0);
        const curDate = new Date();
        await modifyMachine(curMachine.id, 1, curDate );
        setMadeStatement(true);
    
    }
    useEffect(() => {
        if (!madeStatement) {
            handleCreation();
        } else if ((time % timeResolution === 0) && madeStatement){
            updateStatement(time);
            const curDate = new Date();
            modifyMachine(curMachine.id, 1, curDate );
        }

    }, [time]);

  const handleReportIssue = () => {
    setIsFormModalOpen(true);
  };

  const onSubmit = async () => {
        if (time > 0) {
        await updateStatement(time);
            const curDate = new Date();
            await modifyMachine(curMachine.id, 1, curDate );    
        }
    redirectPage($router, "interlockLogin");
  };
;
    

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Time spent</CardTitle>
          <CardDescription>
            Below is the amount of time that will be billed to {curBudget.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            data-cy="timer"
            className="flex justify-center text-5xl font-bold"
          >
            <Timer time={time} />
          </div>
        </CardContent>
        <CardFooter className="relative flex items-center justify-end w-full" data-cy="submit">
          <Button
            className="px-4 py-2 ml-4 text-black bg-yellow-400"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleReportIssue();
            }}
          >
            Report Issue
          </Button>
          <Button
            className="absolute transform -translate-x-1/2 left-1/2"
            onClick={onSubmit}
          >
            Tap when finished!
          </Button>
        </CardFooter>
      </Card>

      <ReportFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        userId={curUser.id}
        machineId={curMachine.id}
        />

    </>
  );
};

export default InProgress;


