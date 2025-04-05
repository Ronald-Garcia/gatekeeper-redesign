import { sendEmail } from "@/data/api"
import { $date, $date_range } from "@/data/store";
import { useStore } from "@nanostores/react";
import { useToast } from "./use-toast";

const useMutationEmails = () => {
    const dateRange = useStore($date_range);
    const date = useStore($date);
    const { toast } = useToast();

    const sendFinancialStatementEmail = async (email: string) => {
        try {
            if (!dateRange) {
                throw new Error("No date range selected");
            } else if (!dateRange.to || !dateRange.from) {
                throw new Error("No date range selected");
            }

            await sendEmail(email, dateRange.to, dateRange.from);
            toast({
                variant: "default",
                title: "✅ Success 😊!",
                description: "Email sent successfully!"
            });
        } catch (e) {
            const errorMessage = (e as Error).message;
            toast({
                variant: "destructive",
                title: "❌ Sorry! There was an error sending the email 🙁",
                description: errorMessage
            });
        }
    }

    const automateFinancialStatementEmail = async (email: string) => {
        try {
            if (!date) {
                throw new Error("No date selected");
            }

            toast({
                variant: "default", 
                title: "✅ Success 😊!",
                description: "Email automation set successfully!"
            });
        } catch (e) {
            const errorMessage = (e as Error).message;
            toast({
                variant: "destructive",
                title: "❌ Sorry! There was an error automating the email 🙁",
                description: errorMessage
            });
        }
    }

    return { sendFinancialStatementEmail, automateFinancialStatementEmail };
}

export default useMutationEmails;