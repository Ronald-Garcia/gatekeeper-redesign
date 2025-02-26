import { useEffect, useState } from "react";
import AdminDashboard from "../pages/admin-dashboard";
import MachineLogin from "../pages/machine-login";
import StartPage from "../pages/start-page";
import { $router } from "@/data/router";
import { openPage, redirectPage } from "@nanostores/router";
import { useStore } from "@nanostores/react";
import useMutationUsers from "@/hooks/user-mutation-hooks";


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

  return (

    <>
    
      {router.route === "machine_login" && <MachineLogin></MachineLogin>}

      {(router.route === "users" ||router.route === "budgetCodes")  && <AdminDashboard></AdminDashboard>}

      {router.route === "start_page" && <StartPage></StartPage>}

    </>
  )  


    
};

export default Body;
