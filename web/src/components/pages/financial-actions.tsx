import { Button } from "../ui/button";
import { openPage } from "@nanostores/router";
import { $router } from "@/data/router";
import Searchbar from "../general/searchbar.tsx";
import { resetSearch } from "@/data/store.ts";

/*
Admin dashboard component
Displays BudgetCodes or Users based on routing. 
*/
const FinancialActions = () => {

  const handleClickOnViewUsers = () => {
    resetSearch();
    openPage($router, "users");
  }
  const handleClickOnViewBudgetCodes = () => {
    resetSearch();
    openPage($router, "budgetCodes");
  }

  
  return (
    <div>
        

      <div data-cy="admin-dashboard">
        <div>
          <Button  className="size-"
            onClick={handleClickOnViewUsers}>
              View Users
          </Button>
          <Button  data-cy="view-budget-codes" className="transition-all"
            onClick={handleClickOnViewBudgetCodes}>
              View Budget Codes
          </Button>


      <div className="admin-actions">
          <div className="relative w-full max-w-lg">
            <Searchbar/>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
};

export default FinancialActions;