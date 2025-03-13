import { Button } from "../ui/button";
import UsersComponent from "../Users/users";
import { $router } from "@/data/router";
import { useStore } from "@nanostores/react";
import BudgetCodes from "../BudgetCodes/budgetCodes";
import { useState } from "react";
import AddUserDialog from "../Users/add-user-dialog";
import AddBudgetCodeDialog from "../BudgetCodes/add-budgetCode-dialogue";
import { redirectPage } from "@nanostores/router";
import AddMachineTypeDialog from "../machine_types/add-machine-type-dialog";
import UserInfo from "../Users/selected-info";
import { $selected } from "@/data/store";
import UsersActions from "./user-actions";
import BudgetActions from "./budget-actions";



/*
Admin dashboard component
Displays BudgetCodes or Users based on routing. 
*/
const AdminDashboard = () => {
  const router = useStore($router);

  const [showAddBudgetCode, setShowAddBudgetCode] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddMachineType, setShowAddMachineType] = useState(false);

  
  const selection = useStore($selected);

  const handleCloseAddUser = () => {
    setShowAddUser(false);
  };

  const handleCloseAddBudgetCode = () => {
    setShowAddBudgetCode(false);
  };

  const handleCloseAddMachineType = () => {
    setShowAddMachineType(false);
  };


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
  } else {
    return(
    <div>
      <BudgetActions/>
      <BudgetCodes/>
    </div>
    )
  }
};
export default AdminDashboard;
