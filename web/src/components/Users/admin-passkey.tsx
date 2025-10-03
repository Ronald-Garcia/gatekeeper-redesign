import { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import useMutationUsers from "@/hooks/user-mutation-hooks";
import { useStore } from "@nanostores/react";
import { $currentUser } from "@/data/store";
import { redirectPage } from "@nanostores/router";
import { $router } from "@/data/router";
import { toast } from "@/hooks/use-toast";

// function that handles state of the dialogue, error handling from api
const AdminPasskeyDialog = () => {
  const {checkAdminPass, createAdminPasskey, verifyAdminPasskey} = useMutationUsers();

  const [pass, setPass] = useState("");
  const [creatingPasskey] = useState(false);
  const curUser = useStore($currentUser);
  const [errors, setErrors] = useState({
    pass: false
  });


  const handleCreatingPasskey = () => {

    checkAdminPass(curUser.id).then((res) => {
      if (res) {
        verifyAdminPasskey(curUser.id, pass).then((ress) => {
          if (ress) {
            redirectPage($router, "users")
          } else {
            toast({
              variant: "destructive",
              title: "❌ Sorry! There was an error logging in 🙁",
                description: "Invalid passkey"
      })          
    }
        }) 
      } else {
        createAdminPasskey(curUser.id, pass);
        redirectPage($router, "users");

      }

    setPass("");

    })
  }


  const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPass(e.target.value);
    setErrors(prev => ({...prev, name: false}));
  }

  return (
    <div data-cy="budget-type-add-dialog">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Please enter your passkey (max 10 characters)</DialogTitle>
          </DialogHeader>
          <Label htmlFor="content" className="text-sm">
            Passkey
          </Label>
          <div className="space-y-4">
            <Input
              onChange={handleOnChangeName}
              placeholder="Enter passkey"
              data-cy="enter-pass"
              className={errors.pass ? "border-red-500" : ""}
            >
            </Input>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="jhu-white-button" variant={"ghost"} data-cy="pass-cancel">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button className="jhu-blue-button" variant={"ghost"} data-cy="pass-confirm" onClick={handleCreatingPasskey }>{creatingPasskey ? "Create" : "Login"}</Button>

            </DialogClose>
          </DialogFooter>
        </DialogContent>
    </div>
  );
};

export default AdminPasskeyDialog;
