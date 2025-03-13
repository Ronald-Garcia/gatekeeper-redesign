import { Button } from "../ui/button";
import { openPage } from "@nanostores/router";
import { $router } from "@/data/router";
import Searchbar from "../general/searchbar.tsx";
import AddBudgetCodeDialog from "../BudgetCodes/add-budgetCode-dialogue.jsx";
import { resetSearch } from "@/data/store.ts";

/*
Admin dashboard component
Displays BudgetCodes or Users based on routing. 
*/
const BudgetActions = () => {

  const handleClickOnViewUsers = () => {
    resetSearch();
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
      <div className="admin-actions">
          <div className="relative w-full max-w-lg">
                <Searchbar/>
          </div>
            <div className="admin-buttons">
            <AddBudgetCodeDialog/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default BudgetActions;