
/*
    This is the actual format of the start page, just takes toggles if you do route or not based on parent.
*/

import { redirectPage } from "@nanostores/router";
import { Button } from "../ui/button";
import { $router } from "@/data/router";

const HomePage = () => {
    const handleInterlockClick = () => {
        redirectPage($router, "interlockLogin");
    }

    const handleKioskClick = () => {
        redirectPage($router, "kiosk");   
    }

  return (
    <div className="justify-center homepage">
        <div className="text-3xl font-semibold text-gray-800 ">Welcome to the Interlock Homepage!</div>
        <div className="mb-4 text-lg text-gray-600">Choose the system you want to sign in to.</div>
        <div className="flex space-x-4">
            <Button onClick={handleInterlockClick} className="jhu-blue-button">Interlock</Button>
            <Button onClick={handleKioskClick} className=" jhu-blue-button">Kiosk</Button>
        </div>
    </div>
  );
};

export default HomePage;