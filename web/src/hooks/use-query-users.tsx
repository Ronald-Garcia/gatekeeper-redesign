import { useStore } from "@nanostores/react";
import {user}

function useQueryUsers() {
  const decks = useStore($users);

  const loadDecks = async (page: number = 1) => {
    try {
      const {
        data: fetchedDecks,
        totalDecks,
        totalPages,
      } = await fetchDecks(page);
      setUsers(fetchedDecks);
      setPage(page);
      setTotalDecks(totalDecks);
      setTotalPages(totalPages);
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error reading the decks 🙁",
        description: errorMessage,
      });
    }
  };

  useEffect(() => {
    loadDecks();
  }, []);

  return { decks, loadDecks };
}

export default useQueryUsers;
