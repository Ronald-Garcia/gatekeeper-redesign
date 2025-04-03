import { DialogContent } from "../ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AutomateFinancialStatementsDialog from "./automate-financial-statements";
import SendFinancialStatementsDialog from "./send-financial-statements-dialog";


const StatementDialog = () => {
    return (
        <>
            <DialogContent>

                <Tabs defaultValue="send" data-cy="statement-tabs">
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