import useMutationEmails from "@/hooks/use-mutation-emails";
import { Button } from "../ui/button";
import { DialogClose,  DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { openPage } from "@nanostores/router";
import { $router } from "@/data/router";
import DatePickerWithRange from "./datepicker";
import { resetDateRange, $date_range } from "@/data/store";
import { useStore } from "@nanostores/react";


const SendFinancialStatementsDialog = () => {

    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({
        email: false,
        date: false
    });

    const dateRange = useStore($date_range);

    const validateInputs = () => {
        const newErrors = {
            email: !email,
            date: !dateRange
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const validateDateRange = () => {

        const newErrors = {
            email: false,
            date: !dateRange || (!dateRange.from || !dateRange.to)
        }

        setErrors(newErrors);

        if (dateRange?.from && dateRange?.to) {
            return dateRange.from <= dateRange.to;
        }
        return false;
    }

    const handleSendEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (validateInputs()) {
            sendFinancialStatementEmail(email);
        } else {
            e.preventDefault();
        }
    }
    const handleGoToStatementsPage = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (validateDateRange()) {
            openPage($router, "financial_statements");

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
                    Send Financial Statements                
                </DialogTitle>    
                <DialogDescription>
                    Please input the email to send the statements to.    
                </DialogDescription>    
                </DialogHeader>

                <div className="flex flex-col space-y-3 p-[20px]">
                    
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
                            Date Range
                        </Label>
                        <div className={`${errors.date ? "border border-red-500 rounded-md" : ""}`}>
                            <DatePickerWithRange/>
                        </div>
                        <Button variant={"link"} onClick={() => {
                            resetDateRange();
                            setErrors(prev => ({...prev, date: false}));
                        }}>
                            Reset Date
                        </Button>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button data-cy = "view-financial-statements" variant={"secondary"} onClick={handleGoToStatementsPage}>
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
        </>
    )
}

export default SendFinancialStatementsDialog;