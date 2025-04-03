
import { Dialog,  DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AutomateFinancialStatementsDialog from "./automate-financial-statements";
import SendFinancialStatementsDialog from "./send-financial-statements-dialog";
import { Button } from "../ui/button";


const StatementDialog = () => {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    variant="ghost"
                    className="justify-start w-full text-green-600 transition-colors duration-200 hover:bg-green-50 text-lg"
                    data-cy="financial-statements-dialog"
                >
                    Send Financial Statements
                </Button>
            </DialogTrigger>
        

        <DialogTitle> </DialogTitle>
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
        
        </Dialog>

    )
}

export default StatementDialog;