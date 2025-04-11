import { useStore } from "@nanostores/react";
import { useState, useEffect } from "react";
import Timer from "./timer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "@/components/ui/button";
import useMutationStatements from "@/hooks/use-mutation-financial-statements";
import { redirectPage } from "@nanostores/router";
import { $router } from "@/data/router";
import { $currentUser, $currentMachine } from "@/data/store";
import useMutationMachineIssue from "@/hooks/use-mutation-machineIssue";
import ReportFormModal from "@/components/modals/ReportFormmodal"; 

const InProgress = () => {
  const curUser = useStore($currentUser);
  const curMachine = useStore($currentMachine);
  const { reportIssue } = useMutationMachineIssue();
  const { curBudget, createStatement } = useMutationStatements();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleReportIssue = () => {
    reportIssue(curUser.id, curMachine.id).then((res) => {
      if (res) {
        console.log("Reported issue:", res);
        setIsFormModalOpen(true);
      }
    });
  };

  const onSubmit = async () => {
    await createStatement(time);
    redirectPage($router, "interlockLogin");
  };

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
            className="flex justify-center font-bold text-5xl"
          >
            <Timer time={time} />
          </div>
        </CardContent>
        <CardFooter className="relative flex justify-end items-center w-full" data-cy="submit">
          <Button
            className="bg-yellow-400 text-black px-4 py-2 ml-4"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleReportIssue();
            }}
          >
            Report Issue
          </Button>
          <Button
            className="absolute left-1/2 transform -translate-x-1/2"
            onClick={onSubmit}
          >
            Tap when finished!
          </Button>
        </CardFooter>
      </Card>

      <ReportFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
      />
    </>
  );
};

export default InProgress;


