import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signOut } from "@/data/api";
import { redirectPage } from "@nanostores/router";
import { $router } from "@/data/router";
import { resetStores } from "@/data/store";
import { useStore } from "@nanostores/react";

 
// function that handles state of the dialogue, error handling from api
const SignOutDialog = () => {
    const router = useStore($router);
  

    const handleSignOut = () => {
        signOut();
        resetStores();
        if (router?.route === "userDashboardUserStats" || router?.route === "userDashboardMachinesStatus" ){
          redirectPage($router, "userDashboard");          
        } else {
          redirectPage($router, "kiosk");
        }
    }

  return (
    <div data-cy="signout-dialog">
      <Dialog>
        <DialogTrigger asChild>
            <Button 
                    variant="ghost"
                    className="text-red-600 transition-colors duration-200 sidebar-button hover:bg-red-50"
                    data-cy="sign-out"
                    >
                    Sign Out
                </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to sign out?</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button className="jhu-white-button" variant={"ghost"} data-cy="signout-cancel">Cancel</Button>
            </DialogClose>

            <Button className="jhu-blue-button" variant={"ghost"} data-cy="signout-confirm" onClick={handleSignOut}>Sign Out</Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignOutDialog;
