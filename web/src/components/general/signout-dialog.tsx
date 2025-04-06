import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { signOut } from "@/data/api";
import { openPage } from "@nanostores/router";
import { $router } from "@/data/router";
import { resetStores } from "@/data/store";

 
// function that handles state of the dialogue, error handling from api
const SignOutDialog = () => {

    const handleSignOut = () => {
        signOut();
        resetStores();
        openPage($router, "start_page");

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
