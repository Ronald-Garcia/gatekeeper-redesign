import { $activeSearch, resetActiveSearch } from "@/data/store";
import { useStore } from "@nanostores/react";
import { Button } from "../ui/button";
import { CrossCircledIcon } from "@radix-ui/react-icons";


//Component that displays active search, and when clicking x on it, clears the active search.
const ActiveSearchDisplay = () => {
    const activeSearch = useStore($activeSearch);
    
    //Function that clears the search.
    const deleteSearch = () => {
        resetActiveSearch();
    }
    if (activeSearch !== "") {
    return(
    <div className="search-query-container">
        <span className="search-query" >{activeSearch}</span>
            <Button variant={"ghost"} onClick={deleteSearch}>
                <CrossCircledIcon/>
            </Button>
    </div>
    )
    }
};
export default ActiveSearchDisplay;