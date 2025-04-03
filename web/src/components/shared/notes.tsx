import useQueryNotes from "@/hooks/use-query-notes";
import { useStore } from "@nanostores/react";
import { $activeSearch, $currentPage, $hasMoreNotes, $setHasMoreSearchedNotes } from "@/lib/store";
import InfiniteScroll from "./infinite-scroll";
import NoteList from "./NoteList";

  const Notes = () => {

  const activeSearch = useStore($activeSearch);
  const {notes, loadNotes, searchNotes, isLoading, searchedNotes} = useQueryNotes();
  const currentPage = useStore($currentPage);
  const hasMoreNotes = useStore($hasMoreNotes)
  const hasMoreSearchedNotes = useStore($setHasMoreSearchedNotes)
    

  const loadMoreNotes = () => {
    if (!hasMoreNotes || isLoading) return;
    loadNotes(currentPage + 1);
  };

  const searchMoreNotes = () => {
    if (!hasMoreSearchedNotes || isLoading && activeSearch !=="" ) return;
    searchNotes(activeSearch, currentPage + 1);
  };

  if ( notes.length !== 0 || searchedNotes.length !== 0 ) {
    return (
      <InfiniteScroll loadMore={loadMoreNotes}
      searchMore = {searchMoreNotes}
      hasMore={hasMoreNotes}
      hasMoreSearch={hasMoreSearchedNotes}
      isLoading={isLoading}
      >
      <NoteList/>
      </InfiniteScroll>
    );  
  }

  if (activeSearch !== ""){
    return (
    <h4 className="flex justify-center gap-3 p-3 small-text bold">
      You have no notes that match this search.
    </h4>
    )
  }

  return (
    <h4 className="flex justify-center gap-3 p-3 small-text bold">
      You have no notes. Add some notes to get started!
    </h4>
  );
};

export default Notes;