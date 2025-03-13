import { useState } from "react";
import UserInfo from "../Users/selected-info";
import { useStore } from "@nanostores/react";
import { $selected } from "@/data/store";
import AddUserDialog from "../Users/add-user-dialog";
import { Button } from "../ui/button";
import { openPage, redirectPage } from "@nanostores/router";
import { $router } from "@/data/router";
import Searchbar from "../ui/searchBar";

/*
Admin dashboard component
Displays BudgetCodes or Users based on routing. 
*/
const BudgetActions = () => {

  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddMachineType, setShowAddMachineType] = useState(false);  

  const handleClickOnViewUsers = () => {
    openPage($router, "users");
  }
  return (
    <div>
      <div data-cy="admin-dashboard">
        <div>
          <Button  className="size-"
            onClick={handleClickOnViewUsers}>
              View Users
          </Button>
          <div className="flex items-center justify-center">

          <div className="relative w-full max-w-lg">
            <Searchbar/>
          </div>

            <div>
            <Button  data-cy="show-budget-code-button" className="size-"
              onClick={() => setShowAddUser(true) }>
                Add Budget Code
            </Button>

            <Button  className="size-"
              onClick={() => setShowAddMachineType(true) }>
                Add MachineType
            </Button>
            </div>
          </div>
          </div>
      </div>
    </div>
  )
};

export default BudgetActions;