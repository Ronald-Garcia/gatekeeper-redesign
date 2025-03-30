import UsersComponent from "../Users/users";
import { $router } from "@/data/router";
import { useStore } from "@nanostores/react";
import BudgetCodes from "../BudgetCodes/budgetCodes";
import UsersActions from "./user-actions";
import BudgetActions from "./budget-actions";
import Sidebar from "../layout/sidebar";

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
        <UsersComponent/>
      </div>
    </div>
    )
  } else {
    return(
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <BudgetActions/>
        <BudgetCodes/>
      </div>
    </div>
    )
  }
};

export default AdminDashboard;
