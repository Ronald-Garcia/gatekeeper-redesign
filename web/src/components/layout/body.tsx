import AdminDashboard from "../pages/admin-dashboard";
import MachineLogin from "../pages/machine-login";
import StartPage from "../pages/start-page";
import { $router } from "@/data/router";
import { useStore } from "@nanostores/react";
import { adminCurrentUser, validCurrentMachine, validCurrentUser } from "@/data/store";
import { useEffect } from "react";
import { redirectPage } from "@nanostores/router";
import Interlock from "../pages/interlock";
import KioskStartPage from "../pages/kiosk-start-page";
import ErrorPage from "./errorPage";
import InProgress from "../pages/in-progress";
import HomePage from "../pages/home-page";
import FormPage from "@/components/pages/form";

import UserStartPage from "../pages/user-dashboard-start-page";
import UserDashboard from "../pages/user-dashboard";
import LostConnectionPage from "../pages/lost-connection-page";

/*
Body component of the application
Handle general routing and validation of users. Routes based on admin status and machine status. 
*/
const Body = () => {

  
  const router = useStore($router);
  //validate user when using the application, else rerouted to start page
  useEffect(() => {
    // This is our error page, don't want to make calls.
    if (!router || router.route === "errorPage" || router.route === "reportForm") {

    }
    else if (!validCurrentMachine() && !validCurrentUser()) {
      redirectPage($router, "start_page");
      //check if user is admin and current machine is valid
    } else if (adminCurrentUser() && !validCurrentMachine()) {
      redirectPage($router, "machine_login");
    } else if (!validCurrentUser() && router.route !== "start_page" && router.route !== "interlockLogin" && router.route !== "kiosk") {
      redirectPage($router, "start_page");
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

      {router.route === "errorPage" && <ErrorPage></ErrorPage>}
    
      {router.route === "machine_login" && <MachineLogin></MachineLogin>}

      {(router.route === "users" || router.route === "budgetCodes" || router.route === "machines" || router.route === "machineIssues" || router.route === "financial_statements") && <AdminDashboard></AdminDashboard>}

      {router.route === "kiosk" && <KioskStartPage></KioskStartPage>}

      {router.route === "start_page" && <HomePage></HomePage>}

      {router.route === "interlock" && <Interlock></Interlock>}

      {router.route === "timer" && <InProgress></InProgress>}

      {router.route === "interlockLogin" && <StartPage></StartPage>}

      {router.route === "reportForm" && <FormPage userId={router.params.userId} machineId={router.params.machineId} />}

      {router.route === "lostConnectionPage" && <LostConnectionPage></LostConnectionPage>}

      {router.route === "userDashboard" && <UserStartPage></UserStartPage>}

      {(router.route === "userDashboardMachinesStatus" || router.route == "userDashboardUserStats") && <UserDashboard></UserDashboard>}

    </>
  )  


    
};

export default Body;
