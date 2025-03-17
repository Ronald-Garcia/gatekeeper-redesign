import { useState, useEffect } from "react";
import Timer from "./timer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "@/components/ui/button";
import useMutationStatements from "@/hooks/use-mutation-financial-statements";
import { openPage } from "@nanostores/router";
import { $router } from "@/data/router";

const InProgress = () => {

    const { curBudget, createStatement } = useMutationStatements();
    

    const [time, setTime] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(()=> {
            setTime(time => time + 1);
        }, 1000)
        return () => {
            clearInterval(interval)
        };
    }, []);
    
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
                    <CardFooter 
                        className="justify-center"
                        data-cy="submit"
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