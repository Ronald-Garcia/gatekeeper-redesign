import useMutationEmails from "@/hooks/use-mutation-emails";
import { Button } from "../ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { openPage } from "@nanostores/router";
import { $router } from "@/data/router";
import DatePickerWithRange from "./datepicker";
import { resetDateRange, $date_range } from "@/data/store";
import { useStore } from "@nanostores/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AutomateFinancialStatementsDialog from "./automate-financial-statements";
import SendFinancialStatementsDialog from "./send-financial-statements-dialog";


const StatementDialog = () => {

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
            <DialogContent>

                <Tabs defaultValue="send" >
                    <TabsList className="w-full">
                        <TabsTrigger value="send" className="w-full"> Send Statements Now! </TabsTrigger>
                        <TabsTrigger value="automate" className="w-full"> Automate Statements! </TabsTrigger>
                    </TabsList>

                    <TabsContent value="send">
                        <SendFinancialStatementsDialog/>
                    </TabsContent>

                    <TabsContent value="automate">
                        <AutomateFinancialStatementsDialog/>
                    </TabsContent>
                </Tabs>
                
                

            </DialogContent>

        </>
    )
}

export default StatementDialog;