import { $router } from "@/data/router";
import { useStore } from "@nanostores/react";
import BudgetCodes from "../BudgetCodes/budgetCodes";
import UsersActions from "./user-actions";
import BudgetActions from "./budget-actions";
import Sidebar from "../layout/sidebar";
import MachineActions from "./machine-actions";
import MachinesComponent from "../machines/machines-component";
import Users from "../Users/users";
import { ScrollArea } from "../ui/scroll-area";
import Pagination_bar from "../general/pagination-bar";

/*
Admin dashboard component
Displays BudgetCodes or Users based on routing. 
*/
const AdminDashboard = () => {
  const router = useStore($router);

  if (!router) {
    return (
      <>
        <div>
        </div>
      </>
    )
  }
  if (router.route === "users") {
    return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <UsersActions/>
        <ScrollArea className="scroll-component">
          <Users/>
        </ScrollArea>
      </div>
    </div>
    )
  } else if (router.route === "budgetCodes"){
    return(
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <BudgetActions/>
        <ScrollArea className="scroll-component">
        <BudgetCodes/>
        </ScrollArea>

      </div>
    </div>
    )
  } else if (router.route === "machines"){
    return(
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
        <MachineActions/>
        <ScrollArea className="scroll-component">
        <MachinesComponent/>
        </ScrollArea>
        <Pagination_bar/>

        </div>
      </div>
      )
  }
};

export default AdminDashboard;
