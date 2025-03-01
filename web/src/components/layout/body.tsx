import AdminDashboard from "../pages/admin-dashboard";
import MachineLogin from "../pages/machine-login";
import StartPage from "../pages/start-page";
import { $router } from "@/data/router";
import { useStore } from "@nanostores/react";
import UsersComponent from "../Users/users";
import { adminCurrentUser, validCurrentMachine, validCurrentUser } from "@/data/store";
import { useEffect } from "react";
import { redirectPage } from "@nanostores/router";
import Interlock from "../pages/interlock";


const Body = () => {

  
  const router = useStore($router);
  // const [userValidated, setUserValidated] =  useState(false);
  // const user = useStore($user);
  // const { fetchUser} = useMutationUsers();
  
  // const [keyboard, setKeyboard] =  useState("");

  if (!router) {
    return (
      <>
        <div>
        </div>
      </>
    )
  }

  useEffect(() => {


    if (!validCurrentMachine() && !validCurrentUser()) {
      redirectPage($router, "start_page");
    } else if (adminCurrentUser() && !validCurrentMachine()) {
      redirectPage($router, "machine_login");
    } 
  }, []);
  

  return (

    <>
    
      {router.route === "machine_login" && <MachineLogin></MachineLogin>}

      {(router.route === "users" || router.route === "budgetCodes") && <AdminDashboard></AdminDashboard>}

      {router.route === "start_page" && <StartPage></StartPage>}

      {router.route === "interlock" && <Interlock></Interlock>}

    </>
  )  


    
};

export default Body;
