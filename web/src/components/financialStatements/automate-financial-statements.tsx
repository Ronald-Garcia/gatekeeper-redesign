import useMutationEmails from "@/hooks/use-mutation-emails";
import { Button } from "../ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { openPage } from "@nanostores/router";
import { $router } from "@/data/router";
import DatePickerWithRange from "./datepicker";
import { resetDateRange, $date_range, $date, resetDate } from "@/data/store";
import { useStore } from "@nanostores/react";
import { DatePicker } from "./datepick";


const AutomateFinancialStatementsDialog = () => {

    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({
        email: false,
        date: false
    });

    const date = useStore($date);

    const validateInputs = () => {
        const newErrors = {
            email: !email,
            date: !date
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSendEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (validateInputs()) {
            sendFinancialStatementEmail(email);
        } else {
            e.preventDefault();
        }
    }
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setErrors(prev => ({...prev, email: false}));
    }

    const { sendFinancialStatementEmail } = useMutationEmails();

    return (
        <>
            <DialogHeader>
                <DialogTitle data-cy="financial-statements-title">
                    Automate Financial Statements                
                </DialogTitle>    
                <DialogDescription>
                    Please input the email to automatically send the statements to.    
                </DialogDescription>    
            </DialogHeader>

                <div className="flex flex-col space-y-3 p-2">
                    
                    <div className="flex flex-row space-x-3">
                        <Label className="self-center">
                            Email
                        </Label>
                        <Input
                            className={`w-full ${errors.email ? "border-red-500" : ""}`}
                            placeholder="Enter email"
                            data-cy="financial-statements-email"
                            onChange={handleEmailChange}
                            value={email}
                        >
                        </Input>
                    </div>

                    <div className="flex flex-row justify-between">
                        <Label className="self-center">
                            Date
                        </Label>
                        <div className={`${errors.date ? "border border-red-500 rounded-md" : ""}`}>
                            <DatePicker/>
                        </div>
                        <Button variant={"link"} onClick={() => {
                            resetDate();
                            setErrors(prev => ({...prev, date: false}));
                        }}>
                            Reset Date
                        </Button>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button data-cy= "close-financial-statements" variant={"secondary"}>
                            Close
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button data-cy = "email-financial-statements"
                            onClick={handleSendEmail}>
                            Automate!
                        </Button>
                    </DialogClose>
                </DialogFooter>
        </>
    )
}

export default AutomateFinancialStatementsDialog;