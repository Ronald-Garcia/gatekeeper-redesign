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
import InfiniteScroll from "../general/infinite-scroll";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

//prop for handling state of the dialogue
type EditBudgetCodeDialogProp = {
    userId: number;
    setShowEditBudgetCode: React.Dispatch<React.SetStateAction<boolean>>;
};

// function that handles state of the dialogue, error handling from api
const EditBudgetCodeDialog = ({ userId, setShowEditBudgetCode }: EditBudgetCodeDialogProp) => {
    const budgetCodeQueue = useStore($budget_code_queue);
    const { setUserBudgetCodes } = useMutationUsers();
    const { loadBudgets, getBudgetsOfUser, currentPage, hasMore, isLoading } = useQueryBudgetCodes(true);
    const [isLoadingUserCodes, setIsLoadingUserCodes] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    
    const codesList = useStore($codes);
  
    const handleLoadMore = () => {
      if (!isLoading && hasMore) {
        loadBudgets("name_asc", currentPage + 1, 10, searchQuery, true);
      }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      loadBudgets("name_asc", 1, 10, query, false);
    };
  
    //async function with editing logic, including error handling
    const handleEditBudgetCode = async () => {
      await setUserBudgetCodes(userId, budgetCodeQueue);
      setShowEditBudgetCode(false);
    };
  
    useEffect(() => {
      setIsLoadingUserCodes(true);
      getBudgetsOfUser(userId).then((res) => {
        if (res === undefined) {
          setBudgetCodeQueue([]);
          return;
        }
        setBudgetCodeQueue(res.map(b => b.id));
      }).finally(() => {
        setIsLoadingUserCodes(false);
      });
    }, []);

    return (
        <Dialog open={true} onOpenChange={setShowEditBudgetCode}>
          <DialogOverlay />
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Budget Code</DialogTitle>
            </DialogHeader>
            <Label htmlFor="content" className="text-sm">
              Please select the title of your budget code
            </Label>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search budget codes..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <ScrollArea className="h-[400px]">
                <InfiniteScroll
                  loadMore={handleLoadMore}
                  hasMore={hasMore}
                  isLoading={isLoading}
                >
                  {isLoadingUserCodes ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
                    </div>
                  ) : (
                    <div className="px-4">
                      <ToggleGroup type="multiple" className="flex-col w-full">
                        {codesList.map((type) => (
                          <ToggleGroupItem
                            key={type.id}
                            value={type.id.toString()}
                            data-cy={`toggle-budget-code-${type.code}`}
                            onClick={() => toggleBudgetCodeQueue(type.id)}
                            className={`flex items-center justify-center h-12 w-full text-sm transition-colors border-y border-solid border-stone-200 hover:bg-stone-50 hover:border-stone-300 cursor-pointer rounded-md ${
                              budgetCodeQueue.some(b => b === type.id) ?
                              "bg-stone-100 border-stone-300" :
                              "bg-white"
                            }`}
                            data-state={budgetCodeQueue.some(b=> b===type.id) ? "on" : "off"}
                            aria-pressed={budgetCodeQueue.some(b=> b===type.id)}
                          >
                            <p className="text-center font-medium">{type.name}</p>
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </div>
                  )}
                </InfiniteScroll>
              </ScrollArea>
            </div>
            <DialogFooter>
              <Button data-cy="add-budget-code-delete" onClick={() => setShowEditBudgetCode(false)}>Cancel</Button>
              <Button data-cy="add-budget-code-save" onClick={handleEditBudgetCode}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

export default EditBudgetCodeDialog;