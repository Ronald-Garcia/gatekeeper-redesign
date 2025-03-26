import useMutationEmails from "@/hooks/use-mutation-emails";
import { Button } from "../ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { openPage } from "@nanostores/router";
import { $router } from "@/data/router";


const SendFinancialStatementsDialog = () => {


    const [email, setEmail] = useState("");

    const handleSendEmail = () => {
        sendFinancialStatementEmail(email);
    }

    useEffect(() => {
        setEmail("rgarci47@jhu.edu");
    }, []);



    const { sendFinancialStatementEmail } = useMutationEmails();

    return (
        <>

        <DialogContent>
            <DialogHeader>
                <DialogTitle data-cy="financial-statements-title">
                    Send Financial Statements                
                </DialogTitle>    
                <DialogDescription>
                    Please input the email to send the statements to.    
                </DialogDescription>    


                <div className="flex space-x-1">
                <Label className="self-center">
                    Email
                </Label>
                <Input
                    defaultValue={"rgarci47@jhu.edu"}
                    disabled
                    data-cy="financial-statements-email"
                    onChange={e => setEmail(e.target.value)}
                >
                </Input>

                </div>

                <p className="text-sm italic">Right now, waiting on Resend to allow for other domains. Can only send to account owner</p>

                <DialogFooter>

                    <DialogClose asChild>
                        <Button data-cy = "view-financial-statements" variant={"secondary"} onClick={() => openPage($router, "financial_statements")}>
                            ...Or see them here!
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button data-cy= "close-financial-statements" variant={"secondary"}>
                            Close
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button data-cy = "email-financial-statements"
                            onClick={handleSendEmail}>
                            Send statements
                        </Button>
                    </DialogClose>

                </DialogFooter>
            </DialogHeader>
            </DialogContent>
        </>
        
    )


}

export default SendFinancialStatementsDialog;