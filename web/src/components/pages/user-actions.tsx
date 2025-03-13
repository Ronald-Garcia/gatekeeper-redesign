import UserInfo from "../Users/selected-info";
import { useStore } from "@nanostores/react";
import { $selected } from "@/data/store";
import AddUserDialog from "../Users/add-user-dialog";
import { Button } from "../ui/button";
import { openPage } from "@nanostores/router";
import { $router } from "@/data/router";
import Searchbar from "../ui/searchBar.jsx";
import AddMachineTypeDialog from "../machine_types/add-machine-type-dialog";

/*
Admin dashboard component
Displays BudgetCodes or Users based on routing. 
*/
const UsersActions = () => {

  const handleClickOnViewBudgetCodes = () => {
    openPage($router, "budgetCodes");
  }

  const selection = useStore($selected);
  
  return (
    <div>
      {/*Adding forms*/}
        {selection &&  (
          <UserInfo></UserInfo>
        )}

      <div data-cy="admin-dashboard">
        <div>
          <Button  className="size-"
            onClick={handleClickOnViewBudgetCodes}>
              View Budget Codes
          </Button>
      <div className="flex items-center justify-center">
          <div className="relative w-full max-w-lg">
                <Searchbar/>
          </div>
            <div>
            <AddUserDialog/>
            </div>
            <div>
            <AddMachineTypeDialog/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default UsersActions;