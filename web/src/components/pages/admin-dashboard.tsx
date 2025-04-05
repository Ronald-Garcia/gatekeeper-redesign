import UsersComponent from "../Users/users";
import { $router } from "@/data/router";
import { useStore } from "@nanostores/react";
import BudgetCodes from "../BudgetCodes/budgetCodes";
import UsersActions from "./user-actions";
import BudgetActions from "./budget-actions";
import Sidebar from "../layout/sidebar";
import MachineActions from "./machine-actions";
import MachinesComponent from "../machines/machines-component";
import InactiveTab from "../general/inactive-tab";

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
        <InactiveTab/>
        <UsersComponent/>
      </div>
    </div>
    )
  } else if (router.route === "budgetCodes"){
    return(
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <BudgetActions/>
        <InactiveTab/>
        <BudgetCodes/>
      </div>
    </div>
    )
  } else if (router.route === "machines"){
    return(
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
        <MachineActions/>
        <InactiveTab/>
        <MachinesComponent/>
        </div>
      </div>
      )
  }
};

export default AdminDashboard;
