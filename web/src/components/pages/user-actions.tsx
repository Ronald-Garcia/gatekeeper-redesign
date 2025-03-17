import UserInfo from "../Users/selected-info";
import { useStore } from "@nanostores/react";
import { $selected, resetSearch } from "@/data/store";
import AddUserDialog from "../Users/add-user-dialog";
import { Button } from "../ui/button"; 
import { openPage } from "@nanostores/router";
import { $router } from "@/data/router";
import Searchbar from "../general/searchbar.tsx";
import AddMachineTypeDialog from "../machine_types/add-machine-type-dialog";
import { Dialog, DialogTrigger } from "../ui/dialog.tsx";
import SendFinancialStatementsDialog from "../financialStatements/send-financial-statements-dialog.tsx";

/*
Admin dashboard component
Displays BudgetCodes or Users based on routing. 
*/
const UsersActions = () => {

  const handleClickOnViewBudgetCodes = () => {
    resetSearch();
    openPage($router, "budgetCodes");
  }

//  const sendFinancialStatements = () => {
//    resetSearch();
//    openPage($router, "financial_statements");
//  }

  const selection = useStore($selected);
  
  return (
    <Dialog>

    <div>
      {/*Adding forms*/}
        {selection &&  (
          <UserInfo></UserInfo>
        )}

      <div data-cy="admin-dashboard">
        <div>
          <Button  data-cy="view-budget-codes" className="size-"
            onClick={handleClickOnViewBudgetCodes}>
              View Budget Codes
          </Button>
          <DialogTrigger asChild>
            <Button  className="size-">
                Send Financial Statements
            </Button>
          </DialogTrigger>
      <div className="admin-actions">
          <div className="relative w-full max-w-lg">
                <Searchbar/>
          </div>
          <div className="admin-buttons">
            <AddUserDialog/>
            </div>
            <div className="admin-buttons">
            <AddMachineTypeDialog/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <SendFinancialStatementsDialog></SendFinancialStatementsDialog>
    </Dialog>

  

  ) 
};

export default UsersActions;