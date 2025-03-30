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
import ErrorPage from "../layout/errorPage.tsx";
import AddMachineDialog from "../machines/add-machine-dialog.tsx";

import StatementDialog from "../financialStatements/statements-dialog.tsx";

/*
Admin dashboard component
Displays BudgetCodes or Users based on routing. 
*/
const UsersActions = () => {

  const router = useStore($router);

  const handleClickOnViewBudgetCodes = () => {
    resetSearch();
    openPage($router, "budgetCodes");
  }

//  const sendFinancialStatements = () => {
//    resetSearch();
//    openPage($router, "financial_statements");
//  }

//<AddMachineDialog />          

  if (!router) {
    return <ErrorPage></ErrorPage>
  }

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
          <Button  data-cy="view-budget-codes" className="transition-all"
            disabled={router.route === "budgetCodes"}
            onClick={handleClickOnViewBudgetCodes}>
              View Budget Codes
          </Button>
          <DialogTrigger asChild>
            <Button data-cy="financial-statements-dialog"  className="transition-all"
              disabled={router.route === "financial_statements"}>
                Send Financial Statements
            </Button>
          </DialogTrigger>

          <AddMachineDialog/>

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

    <StatementDialog></StatementDialog>
    </Dialog>

  

  ) 
};

export default UsersActions;