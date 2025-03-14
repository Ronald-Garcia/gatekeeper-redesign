import { useStore } from "@nanostores/react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { $currentUser, clearCurrentUser } from "@/data/store";
import { useEffect, useState } from "react";
import { BudgetCode } from "@/data/types/budgetCode";
import useQueryBudgets from "@/hooks/use-query-budgetCodes";
import { redirectPage } from "@nanostores/router";
import { $router } from "@/data/router";
import { turnOnMachine } from "@/data/api";

/*
Display to use on gates when a user logs in. Displays BudgetCodes a user has associated with his account. 
*/
const Interlock = () => {

    const curUser = useStore($currentUser);
    const { getBudgetsOfUser } = useQueryBudgets(false);
    const [userBudgets, setUserBudgets] = useState<BudgetCode[]>([]);
    
    const handleCancel = () => {
        clearCurrentUser();
        redirectPage($router, "start_page");
    }

    const handleStartClick = () => {
        turnOnMachine()
    }

    const [toggled, setToggled] = useState(false);

    useEffect(() => {
        getBudgetsOfUser(curUser.id, setUserBudgets);
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
                        <ToggleGroup type="single">
                            {userBudgets.map((code) => {
                                return (
                                    <div>
                                    <ToggleGroupItem
                                        className={code.name}
                                        key={"val" + code.id} 
                                        value={"val" + code.id} 
                                        variant="outline"
                                        onClick={async () => {setToggled(!toggled)}}> 
                                    </ToggleGroupItem>
                                    
                                    </div>
                                );
                            })}
                            <div>Potato</div>
                        </ToggleGroup>

                    </CardContent>
                    <CardFooter className="flex justify-end space-x-4">
                        {toggled && 
                        <Button className="text-xl jhu-blue-button" variant="ghost" onClick={handleStartClick}>Start</Button>
                        }
                        <Button variant="secondary" onClick={handleCancel} className="text-xl"> Cancel </Button>
                    </CardFooter>
                </Card>
            </div>

        </>
    )

}

export default Interlock;