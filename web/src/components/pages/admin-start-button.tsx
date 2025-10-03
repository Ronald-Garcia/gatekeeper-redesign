import { Button } from "../ui/button"
import { Dialog, DialogTrigger } from "../ui/dialog"
import AdminPasskeyDialog from "../Users/admin-passkey"


export const AdminStartButton = () => {


    return (
        <Dialog>
            <DialogTrigger asChild>

                <Button>
                    Sign In
                </Button>

            </DialogTrigger> 
            <AdminPasskeyDialog></AdminPasskeyDialog>
        </Dialog>
    )
}