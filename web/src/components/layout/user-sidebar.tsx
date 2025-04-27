import { $currentUser, resetSearch } from "@/data/store";
import { useStore } from "@nanostores/react";
import { $router } from "@/data/router";
import { openPage } from "@nanostores/router";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import SignOutDialog from "../general/signout-dialog";


const UserSidebar = () => {
    const user = useStore($currentUser);
    const router = useStore($router);

    const handleClickOnViewMachines = () => {
        resetSearch();
        openPage($router, "userDashboardMachinesStatus");
    }

    const handleClickOnViewUserStats = () => {
        resetSearch();
        openPage($router, "userDashboardUserStats");
    }
    

    // Set users as default route if no route is selected
    if (!router?.route) {
        openPage($router, "users");
    }

    return (
        <div className="sidebar">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold">Welcome, <b className="text-2xl">{user.name}</b></h1>
            </div>
            
            <nav className="space-y-2">
                <Button 
                    variant="ghost" 
                    className={cn(
                        "w-full justify-start transition-colors duration-200 text-lg",
                        (!router?.route || router.route === "userDashboardMachinesStatus") && "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    )}
                    data-cy="user-machines"
                    onClick={handleClickOnViewMachines}
                >
                    Machines
                </Button>
                
                <Button 
                    variant="ghost"
                    className={cn(
                        "w-full justify-start transition-colors duration-200 text-lg",
                        router?.route === "userDashboardUserStats" && "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    )}
                    data-cy="user-stats"
                    onClick={handleClickOnViewUserStats}
                >
                    User Stats
                </Button>
                

                <div className="pt-4 border-t border-gray-200">
                <SignOutDialog />
                </div>

            </nav>
        </div>
    )
}

export default UserSidebar;
