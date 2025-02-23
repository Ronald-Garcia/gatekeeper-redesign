//import useMutationDecks from "@/hooks/use-mutation-decks";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { User } from "../components/types/user";

//prop for handling state of the dialog
type DeleteDeckDialogProp = {
  deck: DeckType;
  setShowDeleteDeck: React.Dispatch<React.SetStateAction<boolean>>;
};

//function that handles state of the dialog
const DeleteDeckDialog = ({
  deck,
  setShowDeleteDeck,
}: DeleteDeckDialogProp) => {
  //const { deleteDeckById } = useMutationDecks();

  //async function that handles deletion logic
  const handleDeleteDeck = async (e: React.MouseEvent) => {
    e.stopPropagation();
   // await deleteDeckById(deck.id);
    setShowDeleteDeck(false); //make the dialog disappear
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDeck(false);
  };

  // Handle dialog close event
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowDeleteDeck(false);
    }
  };

  return (
    <AlertDialog open={true} onOpenChange={handleDialogClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteDeck}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDeckDialog;
