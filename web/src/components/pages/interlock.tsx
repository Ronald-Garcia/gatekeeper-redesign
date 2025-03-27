import { useStore } from "@nanostores/react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { $curbudgets, $currentBudget, $currentUser, clearCurrentBudget, clearCurrentUser, setCurrentBudget, validCurrentBudget } from "@/data/store";
import { useEffect } from "react";
import useQueryBudgets from "@/hooks/use-query-budgetCodes";
import { openPage, redirectPage } from "@nanostores/router";
import { $router } from "@/data/router";
import { turnOffMachine, turnOnMachine } from "@/data/api";

/*
Display to use on gates when a user logs in. Displays BudgetCodes a user has associated with his account. 
*/
const Interlock = () => {

    const curUser = useStore($currentUser);
    const curBudget = useStore($currentBudget);
    const { getBudgetsOfUser } = useQueryBudgets(false);
    const userBudgets = useStore($curbudgets);
    
    const handleCancel = () => {
        clearCurrentUser();
        turnOffMachine()
        redirectPage($router, "start_page");
    }

    const handleStartClick = () => {


        turnOnMachine().then(res => {
            if (res) {
                openPage($router, "timer");
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
                        { 
                        <Button data-cy="start-button" className="text-xl jhu-blue-button" variant="ghost" disabled={!validCurrentBudget()} onClick={handleStartClick}>Start</Button>
                        }
                        <Button variant="secondary" onClick={handleCancel} className="text-xl"> Cancel </Button>
                    </CardFooter>
                </Card>
            </div>

        </>
    )

}

export default Interlock;