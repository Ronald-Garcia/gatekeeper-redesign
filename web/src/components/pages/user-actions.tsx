import { useStore } from "@nanostores/react";
import AddUserDialog from "../Users/add-user-dialog";
import { $router } from "@/data/router";
import AddMachineTypeDialog from "../machine_types/add-machine-type-dialog";
import { Dialog } from "../ui/dialog";
import SendFinancialStatementsDialog from "../financialStatements/send-financial-statements-dialog";
import ErrorPage from "../layout/errorPage";
import Searchbar from "../general/searchbar";

/*
Admin dashboard component
Displays BudgetCodes or Users based on routing. 
*/
const UsersActions = () => {
  const router = useStore($router);


  if (!router) {
    return <ErrorPage></ErrorPage>
  }

  return (
    <Dialog>
      <div data-cy="admin-dashboard" className="w-full p-4 bg-white border-b">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
            <div className="flex-1 w-full">
              <Searchbar/>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <AddUserDialog/>
              <AddMachineTypeDialog/>
            </div>
          </div>
        </div>
      </div>
      <SendFinancialStatementsDialog/>
    </Dialog>
  ) 
};

export default UsersActions;