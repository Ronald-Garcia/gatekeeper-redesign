import Searchbar from "../general/searchbar";
import AddBudgetCodeDialog from "../BudgetCodes/add-budgetCode-dialogue";
import { Dialog } from "../ui/dialog";
import AddBudgetCodeTypeDialog from "../BudgetCodeTypes/add-budget-type";
import GeneralizedFilter from "../general/filtering";
import ClearFiltering from "../general/clear-filtering";

/*
Admin dashboard component
Displays BudgetCodes or Users based on routing. 
*/
const BudgetActions = () => {
  return (
    <div>
      <Dialog>
        <div data-cy="admin-dashboard" className="w-full p-4 bg-white border-b">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1 w-full">
                <Searchbar/>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                  <ClearFiltering />  
               <GeneralizedFilter filters={["budgetTypeId"]} />
                <AddBudgetCodeDialog/>
                <AddBudgetCodeTypeDialog />
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
};

export default BudgetActions;