import { useStore } from "@nanostores/react";
import AddUserDialog from "../Users/add-user-dialog";
import { $router } from "@/data/router";
import { Dialog } from "../ui/dialog";
import ErrorPage from "../layout/errorPage";
import Searchbar from "../general/searchbar";
import GeneralizedFilter from "../general/filtering";

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
          <div className="flex flex-row items-center gap-4">
            <div className="flex flex-row w-full gap-2">
              <Searchbar/>
              <GeneralizedFilter filters={["gradYear", "budgetCodeId", "machineTypeId"]} />
              <AddUserDialog/>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">

            </div>
          </div>
        </div>
      </div>
    </Dialog>
  ) 
};

export default UsersActions;