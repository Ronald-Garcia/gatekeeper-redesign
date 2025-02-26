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

      {router.route === "dashboard" && <AdminDashboard></AdminDashboard>}

      {router.route === "start_page" && <StartPage></StartPage>}

    </>
  )  


 // const user = useStore($user)
  // useEffect(() =>  {

  //   if (keyboard !=== "") {

  //     fetchUser(keyboard);

  //     //validateUser(user);


  //   }

     
  
    
  // },[]);
    
    
  //     if (!userValidated) {
  //         return <MachineLogin />;
  //       }

       
  //       if (user.isAdmin) {
        
  //         return <MachineSelection />;
  //       } else {
  //         return <StartPage />;
  //       }
      
          
    
};

export default Body;
