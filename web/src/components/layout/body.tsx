import AdminDashboard from "../pages/admin-dashboard";
import MachineLogin from "../pages/machine-login";
import StartPage from "../pages/start-page";
import { $router } from "@/data/router";
import { useStore } from "@nanostores/react";
import { adminCurrentUser, validCurrentMachine, validCurrentUser } from "@/data/store";
import { useEffect, useState } from "react";
import { redirectPage } from "@nanostores/router";
import Interlock from "../pages/interlock";
import KioskStartPage from "../pages/kiosk-start-page";
import ErrorPage from "./errorPage";
import InProgress from "../pages/in-progress";

/*
Body component of the application
Handle general routing and validation of users. Routes based on admin status and machine status. 
*/
const Body = () => {

  
  const router = useStore($router);

  const [kiosk, setIsKiosk] = useState(false)

  //validate user when using the application, else rerouted to start page
  useEffect(() => {
    // This is our error page, don't want to make calls.
    if (!router) {

    }
    // kiosk gets special treatment to avoid machine stuff.
    else if (router.route === "kiosk" || kiosk) {
      setIsKiosk(true)
    }
    else if (!validCurrentMachine() && !validCurrentUser()) {
      redirectPage($router, "start_page");
      //check if user is admin and current machine is valid
    } else if (adminCurrentUser() && !validCurrentMachine()) {
      redirectPage($router, "machine_login");
    } 
  }, []);

  if (!router) {
    return (
        <ErrorPage/>
    )
  }
  
// following pages are only acessible to admin users
  else return (

    <>
    
      {router.route === "machine_login" && <MachineLogin></MachineLogin>}

      {(router.route === "users" || router.route === "budgetCodes" || router.route === "machines") && <AdminDashboard></AdminDashboard>}

      {router.route === "kiosk" && <KioskStartPage></KioskStartPage>}

      {router.route === "start_page" && <StartPage></StartPage>}

      {router.route === "interlock" && <Interlock></Interlock>}

      {router.route === "timer" && <InProgress></InProgress>}

    </>
  )  


    
};

export default Body;
