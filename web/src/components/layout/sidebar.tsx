import { $currentUser, resetSearch } from "@/data/store";
import { useStore } from "@nanostores/react";
import { $router } from "@/data/router";
import { openPage } from "@nanostores/router";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogTrigger } from "../ui/dialog";
import SendFinancialStatementsDialog from "../financialStatements/send-financial-statements-dialog";

const Sidebar = () => {
    const user = useStore($currentUser);
    const router = useStore($router);

    const handleClickOnViewUsers = () => {
        resetSearch();
        openPage($router, "users");
    }

    const handleClickOnViewBudgetCodes = () => {
        resetSearch();
        openPage($router, "budgetCodes");
    }

    // Set users as default route if no route is selected
    if (!router?.route) {
        openPage($router, "users");
    }

    return (
        <div className="w-64 h-screen bg-white border-r border-gray-200 p-4">
            <div className="mb-8">
                <h1 className="text-xl font-semibold">Welcome {user.name}</h1>
            </div>
            
            <nav className="space-y-2">
                <Button 
                    variant="ghost" 
                    className={cn(
                        "w-full justify-start transition-colors duration-200",
                        (!router?.route || router.route === "users") && "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    )}
                    onClick={handleClickOnViewUsers}
                >
                    Users
                </Button>
                
                <Button 
                    variant="ghost"
                    className={cn(
                        "w-full justify-start transition-colors duration-200",
                        router?.route === "budgetCodes" && "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    )}
                    onClick={handleClickOnViewBudgetCodes}
                >
                    Budget Codes
                </Button>

                <div className="pt-4 border-t border-gray-200">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button 
                                variant="ghost"
                                className="w-full justify-start transition-colors duration-200 text-green-600 hover:bg-green-50"
                                data-cy="financial-statements-dialog"
                            >
                                Send Financial Statements
                            </Button>
                        </DialogTrigger>
                        <SendFinancialStatementsDialog />
                    </Dialog>
                </div>
            </nav>
        </div>
    )
}

export default Sidebar;
