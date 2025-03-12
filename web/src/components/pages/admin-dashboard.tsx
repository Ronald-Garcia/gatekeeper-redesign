import { Button } from "../ui/button";
import UsersComponent from "../Users/users";
import { $router } from "@/data/router";
import { useStore } from "@nanostores/react";
import BudgetCodes from "../BudgetCodes/budgetCodes";
import { useState } from "react";
import AddUserDialog from "../Users/add-user-dialogue";
import AddBudgetCodeDialog from "../BudgetCodes/add-budgetCode-dialogue";
import { redirectPage } from "@nanostores/router";
import AddMachineTypeDialog from "../machine_types/add-machine-type-dialog";
import UserInfo from "../Users/selected-info";
import { $selected } from "@/data/store";
import UsersActions from "./user-actions";
import BudgetActions from "./budget-code-actions";



/*
Admin dashboard component
Displays BudgetCodes or Users based on routing. 
*/
const AdminDashboard = () => {

  
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


  const router = useStore($router);
  // Don't think we need this.
  if (!router) {
    return (
      <>
        <div>
        </div>
      </>
    )
  }

  else return (
    <div>

{/*Adding forms*/}
{selection &&  (
  <UserInfo></UserInfo>
)}

{showAddUser && (
  <AddUserDialog  setShowAddUser={handleCloseAddUser} />
)}

{showAddBudgetCode && (
  <AddBudgetCodeDialog  setShowAddBudgetCode={handleCloseAddBudgetCode} />
)}

{showAddMachineType && (
  <AddMachineTypeDialog  setShowAddMachineType={handleCloseAddMachineType} />
)}

{/* Search Bar and Buttons to trigger adding forms */}
      <div data-cy="admin-dashboard">
        <div>
        {router.route === "budgetCodes" &&
           <Button  className="size-"
           onClick={() => redirectPage($router, "users") }>
             View Users
         </Button>
        }

       {router.route === "users" &&
            <Button  className="size-"
            onClick={() => redirectPage($router, "budgetCodes") }>
              View BudgetCodes
          </Button>
        }
        </div>
     
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search"
              className="w-full p-4 pl-12 text-lg transition duration-300 ease-in-out border border-gray-600 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            />
          </div>
          {router.route === "budgetCodes" &&
          <Button  className="size-"
            onClick={() => setShowAddBudgetCode(true) }>
              Add Budget Code 
          </Button>
        }

       {router.route === "users" && <div>
          <Button  data-cy="add-user-button" className="size-"
            onClick={() => setShowAddUser(true) }>
              Add User 
          </Button>

          <Button  className="size-"
            onClick={() => setShowAddMachineType(true) }>
              Add MachineType
          </Button>

          </div>

        }
        </div>

        {/* User or Budget Component that displays list of current data on db */}
        
        <div>
          {router.route === "users" && <UsersComponent></UsersComponent>}
          {router.route === "budgetCodes" && <BudgetCodes></BudgetCodes>} 
        </div>
        
      </div>

    </div>
  );
};

export default AdminDashboard;
