import { setActiveSearch } from "@/data/store";
import { useState } from "react";
import ActiveSearchDisplay from "./active-search-display";

const Searchbar =  () => {

    // Want to create a value field that is accessible outside of the function.
    // So, we are going to use stores to create an "active search" usable by other components.
    const [localSearch, setLocalSearch] = useState("")
    

    //Where we update the localSearch to activesearch, to be used by other components.
    const handleSearch = () => {
        setActiveSearch(localSearch);
    }

    //Checks if we hit enter to submit. Add a search button later.
    const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter"){
            handleSearch();
        } 
    }

    //Helper to locally track what is in search bar.
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearch(e.target.value);
    };

    return (
        <div>
        <input
            type="text"
            placeholder="Search"
            className="w-full p-4 pl-12 text-lg transition duration-300 ease-in-out border border-gray-600 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            onKeyDown={handleKeydown}
            onChange={handleTextChange}
        />
            <ActiveSearchDisplay/>
        </div>
    );
} ;
export default Searchbar;