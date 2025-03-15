import UsersComponent from "../Users/users";
import { $router } from "@/data/router";
import { useStore } from "@nanostores/react";
import BudgetCodes from "../BudgetCodes/budgetCodes";
import UsersActions from "./user-actions";
import BudgetActions from "./budget-actions";
import FinancialStatements from "../financialStatements/financialStatements";


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
    <div>
      <UsersActions/>
      <UsersComponent/>
    </div>
    )
  } else if (router.route === "financial_statements"){
    return (<div>
      
      <FinancialStatements/>
    </div>);
  }
  else {
    return(
    <div>
      <BudgetActions/>
      <BudgetCodes/>
    </div>
    )
  }
};
export default AdminDashboard;
