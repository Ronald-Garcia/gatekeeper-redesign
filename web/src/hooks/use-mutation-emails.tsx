import { sendEmail } from "@/data/api"
import { $date_range } from "@/data/store";
import { useStore } from "@nanostores/react";
import { toast } from "sonner";


const useMutationEmails = () => {

    const dateRange = useStore($date_range);


    const sendFinancialStatementEmail = async (email: string) => {
        try {

            if (!dateRange) {
                throw new Error("No date range selected");
            } else if (!dateRange.to || !dateRange.from) {
                throw new Error("No date range selected");
            }

            await sendEmail(email, dateRange.to, dateRange.from);
        } catch (e) {
            const errorMessage = (e as Error).message;
            toast.error("Sorry! There was an error saving the Machine  🙁", {
                description: errorMessage  
            });
        }
    }

    return { sendFinancialStatementEmail };
}

export default useMutationEmails;