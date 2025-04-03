import { $activeSearch } from "@/data/store";
import { useStore } from "@nanostores/react";
import { UpdateIcon } from "@radix-ui/react-icons";
import { ReactNode, useCallback, useEffect, useRef } from "react";

interface InfiniteScrollProps {
  children: ReactNode;
  loadMore: () => void;
  searchMore: () => void;
  hasMore: boolean;
  hasMoreSearch:boolean;
  isLoading: boolean;
  observerOptions?: IntersectionObserverInit;
  loader?: ReactNode;
}

const InfiniteScroll = ({
  children,
  loadMore,
  searchMore,
  hasMore,
  hasMoreSearch,
  isLoading,
  observerOptions = {
    root: null,
    rootMargin: "20px",
    threshold: 0,
  },
  loader = (
    <div className="flex justify-center py-4">
      <UpdateIcon className="w-6 h-6 animate-spin" />
    </div>
  ),
}: InfiniteScrollProps) => {
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const activeSearch = useStore($activeSearch)

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMore && !isLoading && activeSearch === "") {
        loadMore();
      }
      else if (entry.isIntersecting && hasMoreSearch && !isLoading){
        searchMore();
      }
    },
    [loadMore,searchMore, hasMore, hasMoreSearch, isLoading],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    const trigger = triggerRef.current;
    if (trigger) {
      observer.observe(trigger);
    }

    // Clean up observer on component unmount
    return () => {
      if (trigger) {
        observer.unobserve(trigger);
      }
    };
  }, [observerOptions, observerCallback]);

  return (
    <div>
      {children}
      {isLoading && loader}
      <div ref={triggerRef} className="h-1" id="trigger" />
    </div>
  );
};

export default InfiniteScroll;