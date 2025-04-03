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
import { $training_queue, $machine_types, setTrainingQueue, toggleTrainingQueue } from "@/data/store";
import useQueryMachines from "@/hooks/use-query-machines";
import InfiniteScroll from "../general/infinite-scroll";

//prop for handling state of the dialogue
type EditTrainingDialogProp = {
  userId: number;
  setShowEditTraining: React.Dispatch<React.SetStateAction<boolean>>;
};

// function that handles state of the dialogue, error handling from api
const EditTrainingDialog = ({ userId, setShowEditTraining }: EditTrainingDialogProp) => {
  const trainingQueue = useStore($training_queue);

    //ADD WHEN ROUTES FIXED
    const { setUserTrainings } = useMutationUsers();
    const { getTrainingsOfUser } = useQueryMachines(true);
    const [isLoading, setIsLoading] = useState(true);
    
    const trainingsList = useStore($machine_types);
  
    //async function with editing logic, including error handling
    const handleEditTraining = async () => {
      //ADD WHEN ROUTES FIXED
      await setUserTrainings(userId, trainingQueue); //use hooks to handle state of budget code
      setShowEditTraining(false); //make the dialogue disappear
    };
  
    /*
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
    */
    useEffect(() => {
      setIsLoading(true);
      getTrainingsOfUser(userId).then((res) => {
        if (res === undefined) {
          setTrainingQueue([]);
          return;
        }
        setTrainingQueue(res.map(b => b.id));
      }).finally(() => {
        setIsLoading(false);
      });
    }, [])
  return (
    <div data-cy= "user-training-dialog">
    <Dialog open={true} onOpenChange={setShowEditTraining}>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Training</DialogTitle>
        </DialogHeader>
        <Label htmlFor="content" className="text-sm">
          Please select the title of your training
        </Label>
        
        <div className="space-y-4">
        {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
                </div>
              ) :  <ScrollArea>
        <ToggleGroup type="multiple" className="flex-col">
              {trainingsList.map((type) => (
                <ToggleGroupItem
                  key={type.id}
                  value={type.id.toString()}
                  onClick={() => toggleTrainingQueue(type.id)}
                  className={`flex flex-col justify-between items-center py-4 max-h-[15vh] text-sm text-clip transition-colors border-y-2 border-solid border-stone-300 hover:bg-stone-100 hover:border-stone-500 cursor-pointer ${
                    trainingQueue.some(b => b === type.id) ?
                    "data-[state=on]" :
                    "data-[state=off]"
                  }` }
                  data-state={trainingQueue.some(b=> b===type.id) ? "on" : "off"}
                  aria-pressed={trainingQueue.some(b=> b===type.id)}
                >
                  <p>{type.name}</p>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </ScrollArea>  }
        </div>

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      loadMachineTypes("asc", currentPage + 1, 10, "", true);
    }
  };

  //async function with editing logic, including error handling
  const handleEditTraining = async () => {
    await setUserTrainings(userId, trainingQueue);
    setShowEditTraining(false);
  };

  useEffect(() => {
    setIsLoadingUserTrainings(true);
    getTrainingsOfUser(userId).then((res) => {
      if (res === undefined) {
        setTrainingQueue([]);
        return;
      }
      setTrainingQueue(res.map(b => b.id));
    }).finally(() => {
      setIsLoadingUserTrainings(false);
    });
  }, []);

  return (
    <div data-cy="user-training-dialog">
      <Dialog open={true} onOpenChange={setShowEditTraining}>
        <DialogOverlay />
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Training</DialogTitle>
          </DialogHeader>
          <Label htmlFor="content" className="text-sm">
            Please select the title of your training
          </Label>
          <div className="space-y-4">
            <ScrollArea className="h-[400px]">
              <InfiniteScroll
                loadMore={handleLoadMore}
                hasMore={hasMore}
                isLoading={isLoading}
              >
                {isLoadingUserTrainings ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
                  </div>
                ) : (
                  <div className="px-4">
                    <ToggleGroup type="multiple" className="flex-col w-full">
                      {trainingsList.map((type) => (
                        <ToggleGroupItem
                          key={type.id}
                          value={type.id.toString()}
                          onClick={() => toggleTrainingQueue(type.id)}
                          className={`flex items-center justify-center h-12 w-full text-sm transition-colors border-y border-solid border-stone-200 hover:bg-stone-50 hover:border-stone-300 cursor-pointer rounded-md ${
                            trainingQueue.some(b => b === type.id) ?
                            "bg-stone-100 border-stone-300" :
                            "bg-white"
                          }`}
                          data-state={trainingQueue.some(b=> b===type.id) ? "on" : "off"}
                          aria-pressed={trainingQueue.some(b=> b===type.id)}
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
            <Button data-cy="user-traning-cancel" onClick={() => setShowEditTraining(false)}>Cancel</Button>
            <Button data-cy="user-training-add" onClick={handleEditTraining}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditTrainingDialog;
