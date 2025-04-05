import { $localSearch, setActiveSearch, setLocalSearch } from "@/data/store";
import ActiveSearchDisplay from "./active-search-display";
import { useStore } from "@nanostores/react";
import { $router } from "@/data/router";
import useQueryUsers from "@/hooks/use-query-users";
import useQueryBudgets from "@/hooks/use-query-budgetCodes";
import { Search } from "lucide-react";
import useQueryMachines from "@/hooks/use-query-machines";

const Searchbar = () => {
    const localSearch = useStore($localSearch)
    const router = useStore($router)

    const { loadUsers } = useQueryUsers(false);
    const { loadBudgets } = useQueryBudgets(false);
    const { loadMachines } = useQueryMachines(false);

    const handleSearch = () => {
        setActiveSearch(localSearch);
        switch (router?.route){
            case "users":
                loadUsers(undefined, undefined, undefined, localSearch);
                break;
            case "budgetCodes":
                loadBudgets(undefined, undefined, undefined, localSearch);
                break;
            case "machines":
                loadMachines(undefined, undefined, undefined, localSearch);
                break;
            default:
        }
    }

    const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter"){
            handleSearch();
        } 
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearch(e.target.value);
    };

    return (
        <div className="relative w-full">
            <div className="relative">
                <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                    data-cy="searchbar"
                    type="text"
                    value={localSearch}
                    placeholder="Search..."
                    className="w-full h-12 pl-10 pr-4 text-base transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    onKeyDown={handleKeydown}
                    onChange={handleTextChange}
                />
            </div>
            <ActiveSearchDisplay/>
        </div>
    );
}

export default Searchbar;