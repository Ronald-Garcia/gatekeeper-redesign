import Searchbar from "../general/searchbar";
import { Dialog } from "../ui/dialog";
import AddMachineDialog from "../machines/add-machine-dialog.tsx";
import AddMachineTypeDialog from "../machine_types/add-machine-type-dialog.tsx";
import GeneralizedFilter from "../general/filtering.tsx";

/*
Admin dashboard component
Displays BudgetCodes or Users based on routing. 
*/
const MachineActions = () => {
  return (
    <div>
      <Dialog>
        <div data-cy="admin-dashboard" className="w-full p-4 bg-white border-b">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
              <div className="flex flex-row w-full gap-2">
                <Searchbar/>
                <GeneralizedFilter filters={["machineTypeId"]} />
                <AddMachineDialog/>
                <AddMachineTypeDialog/>
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

export default MachineActions;