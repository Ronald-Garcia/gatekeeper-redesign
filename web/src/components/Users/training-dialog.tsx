import { useEffect, useState } from "react";
import useMutationUsers from "@/hooks/user-mutation-hooks";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { useStore } from "@nanostores/react";
import { $machine_types, $training_queue, setTrainingQueue, toggleTrainingQueue } from "@/data/store";
import useQueryMachines from "@/hooks/use-query-machines";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import InfiniteScroll from "../general/infinite-scroll";

type EditTrainingDialogProp = {
  userId: number;
  setShowEditTraining: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditTrainingDialog = ({ userId, setShowEditTraining }: EditTrainingDialogProp) => {
  const trainingQueue = useStore($training_queue);
  const { setUserTrainings } = useMutationUsers();
  const { loadMachineTypes, getTrainingsOfUser, currentPage, hasMore, isLoading } = useQueryMachines(true);
  const [isLoadingUserTrainings, setIsLoadingUserTrainings] = useState(true);
  const trainingsList = useStore($machine_types);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      loadMachineTypes("asc", currentPage + 1, 10, "", true);
    }
  };

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
                          data-cy = {`toggle-training-${type.name}`}
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
            <Button data-cy="training-save" onClick={handleEditTraining}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditTrainingDialog;