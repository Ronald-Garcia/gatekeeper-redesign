import Searchbar from "../general/searchbar";
import AddBudgetCodeDialog from "../BudgetCodes/add-budgetCode-dialogue";
import { Dialog } from "../ui/dialog";
import AddBudgetCodeTypeDialog from "../BudgetCodeTypes/add-budget-type";
import GeneralizedFilter from "../general/filtering";

/*
Admin dashboard component
Displays BudgetCodes or Users based on routing. 
*/
const BudgetActions = () => {
  return (
    <div>
      <Dialog>
        <div data-cy="admin-dashboard" className="w-full p-4 bg-white border-b">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
              <div className="flex flex-row w-full gap-2">
                <Searchbar/>
                <GeneralizedFilter filters={["budgetTypeId"]} />
                <AddBudgetCodeDialog/>
                <AddBudgetCodeTypeDialog />
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">

              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
};

export default BudgetActions;