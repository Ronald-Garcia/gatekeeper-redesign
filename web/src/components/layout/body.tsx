import AdminDashboard from "../pages/admin-dashboard";
import MachineLogin from "../pages/machine-login";
import StartPage from "../pages/start-page";
import { $router } from "@/data/router";
import { useStore } from "@nanostores/react";
import { adminCurrentUser, validCurrentMachine, validCurrentUser } from "@/data/store";
import { useEffect } from "react";
import { redirectPage } from "@nanostores/router";
import Interlock from "../pages/interlock";

/*
Body component of the application
Handle general routing and validation of users. Routes based on admin status and machine status. 
*/
const Body = () => {

  
  const router = useStore($router);

  if (!router) {
    return (
      <>
        <div>
        </div>
      </>
    )
  }

  //validate user when using the application, else rerouted to start page
  useEffect(() => {
    if (!validCurrentMachine() && !validCurrentUser()) {
      redirectPage($router, "start_page");
      //check if user is admin and current machine is valid
    } else if (adminCurrentUser() && !validCurrentMachine()) {
      redirectPage($router, "machine_login");
    } 
  }, []);
  
// following pages are only acessible to admin users
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
