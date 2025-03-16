import { sendEmail } from "@/data/api"
import { toast } from "sonner";


const useMutationEmails = () => {



    const sendFinancialStatementEmail = async (email: string) => {
        try {
            await sendEmail(email);
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