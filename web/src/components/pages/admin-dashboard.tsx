import { Button } from "../ui/button";
import UsersComponent from "../Users/users";
import { $router } from "@/data/router";
import { useStore } from "@nanostores/react";
import BudgetCodes from "../BudgetCodes/budgetCodes";
import { useState } from "react";

const AdminDashboard = () => {

  
  const [showAddBudgetCode, setShowAddBudgetCode] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);

  

  const router = useStore($router);
  if (!router) {
    return (
      <>
        <div>
        </div>
      </>
    )
  }


  return (
    <>
      <div>
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search"
              className="w-full p-4 pl-12 text-lg  border border-gray-600 rounded-full focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition duration-300 ease-in-out shadow-lg"
            />
          </div>
          {router.route === "budgetCodes" &&
          <Button  className="size-"
            onClick={() => setShowAddBudgetCode(true) }>
              Add Budget Code 
          </Button>
        }

       {router.route === "users" &&
          <Button  className="size-"
            onClick={() => setShowAddUser(true) }>
              Add User 
          </Button>
        }
        </div>
        <div>
          {router.route === "users" && <UsersComponent></UsersComponent>}
          {router.route === "budgetCodes" && <BudgetCodes></BudgetCodes>} 
        </div>
        
      
      </div>

    </>
  );
};

export default AdminDashboard;
