/*

This is the actual format of the start page, just takes toggles if you do route or not based on parent.
*/

import { redirectPage } from "@nanostores/router";
import { Button } from "../ui/button";
import { $router } from "@/data/router";

const LostConnectionPage = () => {
    const handleInterlockClick = () => {
        redirectPage($router, "interlockLogin");
    }

  return (
    <div className="justify-center homepage">
        <div className="text-3xl font-semibold text-gray-800 ">Lost Connection To Server</div>
        <div className="mb-4 text-lg text-gray-600">Continue in Offline Mode</div>
        <div className="flex space-x-4">
            <Button data-cy="interlock-button" variant={"ghost"} onClick={handleInterlockClick} className="jhu-blue-button">Try Online Mode</Button>
        </div>
    </div>
  );
};

export default LostConnectionPage;