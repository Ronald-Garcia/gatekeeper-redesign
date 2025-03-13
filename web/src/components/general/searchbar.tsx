import { $localSearch, setActiveSearch, setLocalSearch } from "@/data/store";
import ActiveSearchDisplay from "./active-search-display";
import { useStore } from "@nanostores/react";
import { $router } from "@/data/router";
import useQueryUsers from "@/hooks/use-query-users";
import useQueryBudgets from "@/hooks/use-query-budgetCodes";

const Searchbar =  () => {

    

    // Want to create a value field that is accessible outside of the function.
    // So, we are going to use stores to create an "active search" usable by other components.
    const localSearch = useStore($localSearch)
    const router = useStore($router)

    const { loadUsers } = useQueryUsers(false);
    const { loadBudgets } = useQueryBudgets(false);

    //Where we update the localSearch to activesearch, to be used by other components.
    const handleSearch = () => {
        setActiveSearch(localSearch);
        //Decide what to clear based on current route
        switch (router?.route){
            case "users":
                loadUsers(undefined, undefined, undefined, localSearch);
                break;
            case "budgetCodes":
                loadBudgets(undefined, undefined, undefined, localSearch);
                break;
            default:
        }
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
            value={localSearch}
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