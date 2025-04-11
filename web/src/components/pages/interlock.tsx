import { useStore } from "@nanostores/react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { $curbudgets, $currentBudget, $currentUser, $currentMachine, clearCurrentBudget, clearCurrentUser, setCurrentBudget, validCurrentBudget, validCurrentUser } from "@/data/store";
import { useEffect } from "react";
import useQueryBudgets from "@/hooks/use-query-budgetCodes";
import useMutationMachineIssue from "@/hooks/use-mutation-machineIssue";
import { redirectPage } from "@nanostores/router";
import { $router } from "@/data/router";
import { turnOffMachine, turnOnMachine } from "@/data/api";
import ConfirmReportModal from "@/components/modals/ConfirmReportModal"; 
import ReportFormModal from "@/components/modals/ReportFormmodal";



/*
Display to use on gates when a user logs in. Displays BudgetCodes a user has associated with his account. 
*/
const Interlock = () => {

    const curUser = useStore($currentUser);
    const curMachine = useStore($currentMachine);
    const curBudget = useStore($currentBudget);
    const { getBudgetsOfUser } = useQueryBudgets(false);
    const userBudgets = useStore($curbudgets);
    const { reportIssue } = useMutationMachineIssue();

    


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    
    const handleCancel = () => {
        clearCurrentUser();
        turnOffMachine()
        redirectPage($router, "interlockLogin");
    }

    const handleReportIssue = () => {
        setIsModalOpen(true);
    };

    const handleConfirmReport = async () => {
        setIsModalOpen(false);
        const result = await reportIssue(curUser.id, curMachine.id); 
        if (result) {
          console.log("Reported issue:", result);
          setIsFormModalOpen(true); // Open the QR form modal
        }
      };
      
      
    

    

    useEffect(() => {
        if(!validCurrentUser()) {
          redirectPage($router, "start_page");
        }
      }, [])
    const handleStartClick = () => {


        turnOnMachine().then(res => {
            if (res) {
                redirectPage($router, "timer");
            }
        })

    }
    useEffect(() => {
        getBudgetsOfUser(curUser.id);
        clearCurrentBudget();
    }, [])

    return (
        <>
            <div className="w-[500px] mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Welcome, {curUser.name}.
                        </CardTitle>
                        <CardDescription className="text-xl italic">
                            {"Select the budget code to be applied."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ToggleGroup data-cy="toggle-budget" type="single" className="flex-col">
                            {userBudgets.map((code) => {
                                return (
                                    <div>
                                    <ToggleGroupItem
                                        className={code.name}
                                        key={"val" + code.id} 
                                        value={"val" + code.id} 
                                        variant="outline"
                                        onClick={async () => {
                                            if (curBudget === code) {
                                                clearCurrentBudget();
                                            } else {
                                                setCurrentBudget(code);
                                            }
                                        }}> 

                                        {code.name}
                                    </ToggleGroupItem>
                                    
                                    </div>
                                );
                            })}
                        </ToggleGroup>

                    </CardContent>
                    <CardFooter className="flex justify-end space-x-4">
                        <Button className="px-4 py-2 text-black bg-yellow-400" variant="ghost" onClick={handleReportIssue}> Report Issue </Button>
                        { 
                        <Button data-cy="start-button" className="text-xl jhu-blue-button" variant="ghost" disabled={!validCurrentBudget()} onClick={handleStartClick}>Start</Button>
                        }
                        <Button variant="secondary" onClick={handleCancel} className="text-xl"> Cancel </Button>
                    </CardFooter>
                </Card>
            </div>

            <ConfirmReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmReport}
            />

            <ReportFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
            />


        </>
    )

}

export default Interlock;