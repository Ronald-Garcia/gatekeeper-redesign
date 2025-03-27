import { useEffect, useState } from "react";
import useMutationUsers from "@/hooks/user-mutation-hooks";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { useStore } from "@nanostores/react";
import { $budget_code_queue, $codes, setBudgetCodeQueue, toggleBudgetCodeQueue } from "@/data/store";
import useQueryBudgetCodes from "@/hooks/use-query-budgetCodes";

//prop for handling state of the dialogue
type EditBudgetCodeDialogProp = {
    userId: number;
    setShowEditBudgetCode: React.Dispatch<React.SetStateAction<boolean>>;
};

// function that handles state of the dialogue, error handling from api
const EditBudgetCodeDialog = ({ userId, setShowEditBudgetCode }: EditBudgetCodeDialogProp) => {

    const budgetCodeQueue = useStore($budget_code_queue);
    //ADD WHEN ROUTES FIXED
    const { setUserBudgetCodes } = useMutationUsers();
    const { getBudgetsOfUser } = useQueryBudgetCodes(true);
    const [isLoading, setIsLoading] = useState(true);
    
    const codesList = useStore($codes);
  
    //async function with editing logic, including error handling
    const handleEditBudgetCode = async () => {
      //ADD WHEN ROUTES FIXED
      await setUserBudgetCodes(userId, budgetCodeQueue); //use hooks to handle state of budget code
      setShowEditBudgetCode(false); //make the dialogue disappear
    };
  
    useEffect(() => {
      setIsLoading(true);
      getBudgetsOfUser(userId).then((res) => {
        if (res === undefined) {
          setBudgetCodeQueue([]);
          return;
        }
        setBudgetCodeQueue(res.map(b => b.id));
      }).finally(() => {
        setIsLoading(false);
      });
    }, [])

    return (
        <Dialog open={true}  onOpenChange={setShowEditBudgetCode}>
          <DialogOverlay />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Budget Code</DialogTitle>
            </DialogHeader>
            <Label htmlFor="content" className="text-sm">
              Please select the title of your budget code
            </Label>
            <div className="space-y-4">
            <ScrollArea>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
                </div>
              ) : (
                <ToggleGroup type="multiple" className="flex-col">
                  {codesList.map((type) => (
                    <ToggleGroupItem
                      data-cy={`toggle-budget-code-${type.code}`}
                      key={type.id}
                      value={type.id.toString()}
                      onClick={() => toggleBudgetCodeQueue(type.id)}
                      className={`flex flex-col justify-between items-center py-4 max-h-[15vh] text-sm text-clip transition-colors border-y-2 border-solid border-stone-300 hover:bg-stone-100 hover:border-stone-500 cursor-pointer ${
                        budgetCodeQueue.some(b => b === type.id) ?
                        "data-[state=on]" :
                        "data-[state=off]"
                      }` }
                      data-state={budgetCodeQueue.some(b=> b===type.id) ? "on" : "off"}
                      aria-pressed={budgetCodeQueue.some(b=> b===type.id)}
                    >
                      <p>{type.name}</p>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
            </ScrollArea>  
            </div>
            <DialogFooter>
              <Button data-cy = "add-budget-code-delete" onClick={() => setShowEditBudgetCode(false)}>Cancel</Button>
              <Button data-cy = "add-budget-code-save" onClick={handleEditBudgetCode}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

export default EditBudgetCodeDialog;