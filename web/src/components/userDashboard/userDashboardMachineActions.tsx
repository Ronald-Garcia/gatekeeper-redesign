import Searchbar from "../general/searchbar";
import { Dialog } from "../ui/dialog";

/*
Admin dashboard component
Displays BudgetCodes or Users based on routing. 
*/
const UserMachineActions = () => {
  return (
    <div>
      <Dialog>
        <div data-cy="admin-dashboard" className="w-full p-4 bg-white border-b">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
              <div className="flex flex-row items-center flex-1 w-full gap-4">
                <Searchbar/>
                <div className="w-[32rem] text-sm text-gray-600">
                  Please wait 7.5 minutes for all machines to update use status, as students may turn off machines in between uses!</div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
};

export default UserMachineActions;