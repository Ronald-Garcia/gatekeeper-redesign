import { $router } from "@/data/router";
import { useStore } from "@nanostores/react";
import { ScrollArea } from "../ui/scroll-area";
import PaginationBar from "../general/pagination-bar";
import { SearchQuerySorts } from "@/data/types/sort";
import { $activeSearch, setMixActive, validCurrentUser } from "@/data/store";
import { useEffect } from "react";
import { redirectPage } from "@nanostores/router";
import UserSidebar from "../layout/user-sidebar";
import useQueryMachines from "@/hooks/use-query-machines";
import UserMachinesComponent from "../userDashboard/userDashboardMachines";
import UserMachineActions from "../userDashboard/userDashboardMachineActions";
import UserDashboardStats from "./user-dashboard-stats";

/*
User dashboard component
Displays BudgetCodes or Users based on routing. 
*/
const UserDashboard = () => {
  const router = useStore($router);

  //Bunch of functions that we cast to the generalized loading function type to pass to pagination.
  const {loadMachines} = useQueryMachines(false);
  const machineLoadFunction = loadMachines as (sort?: SearchQuerySorts, page?: number, limit?: number, search?: string) => void


  const activeSearch = useStore($activeSearch);
  setMixActive(true);

  useEffect(() => {
    if(!validCurrentUser()) {
      redirectPage($router, "start_page");
    }
  }, [])

  if (!router) {
    return (
      <>
        <div>
        </div>
      </>
    )
  }
  if (router.route === "userDashboardMachinesStatus") {
    return (
    <div className="flex">
      <UserSidebar />
      <div className="flex-1">
        <UserMachineActions/>
        <ScrollArea className={`${activeSearch ? 'scroll-component-search' : 'scroll-component'}`}>
          <UserMachinesComponent/>
        </ScrollArea>
        <PaginationBar loadFunction={machineLoadFunction}/>
      </div>
    </div>
    )
  } else if (router.route === "userDashboardUserStats"){
    return(
    <div className="flex">
      <UserSidebar />
      <div className="admin-dashboard">
        {/* <ScrollArea className={`${activeSearch ? 'scroll-component-search' : 'scroll-component'}`}> */}
          <div>
          <UserDashboardStats/>
          </div>
        {/* </ScrollArea> */}
      </div>
    </div>
    )
  } 
};

export default UserDashboard;
