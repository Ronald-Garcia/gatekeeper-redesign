import { useStore } from "@nanostores/react";
import AddUserDialog from "../Users/add-user-dialog";
import { $router } from "@/data/router";
import { Dialog } from "../ui/dialog";
import ErrorPage from "../layout/errorPage";
import Searchbar from "../general/searchbar";
import GeneralizedFilter from "../general/filtering";
import ClearFiltering from "../general/clear-filtering";

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
              <ClearFiltering />  
              <AddUserDialog/>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  ) 
};

export default UsersActions;