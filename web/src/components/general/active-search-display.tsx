import { $activeSearch, resetSearch } from "@/data/store";
import { useStore } from "@nanostores/react";
import { Button } from "../ui/button";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import useQueryUsers from "@/hooks/use-query-users";
import useQueryBudgets from "@/hooks/use-query-budgetCodes";
import { $router } from "@/data/router";
import useQueryMachines from "@/hooks/use-query-machines";


//Component that displays active search, and when clicking x on it, clears the active search.
const ActiveSearchDisplay = () => {
    //Our loaders.
    const { loadUsers } = useQueryUsers(false);
    const { loadBudgets } = useQueryBudgets(false);
    const { loadMachines } = useQueryMachines(false);

    const router = useStore($router)
    const activeSearch = useStore($activeSearch);
    
    //Function that clears the search, both in search bar and in this component.
    const deleteSearch = () => {
        resetSearch();
        //Decide what to clear based on current route
        switch (router?.route){
            case "users":
                loadUsers();
                break;
            case "budgetCodes":
                loadBudgets();
                break;
            case "machines":
                loadMachines();
                break;
            default:
        }
    }

    if (activeSearch !== "") {
        return (
            <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center flex-1 h-12 px-4 py-2 text-base text-gray-700 border border-gray-200 rounded-lg bg-gray-50">
                    {activeSearch}
                </div>
                <Button 
                    data-cy="clear-search-button" 
                    variant="ghost" 
                    size="icon"
                    className="w-12 h-12 hover:bg-gray-100"
                    onClick={deleteSearch}
                >
                    <CrossCircledIcon className="w-5 h-5 text-gray-500"/>
                </Button>
            </div>
        )
    }
    return null;
};

export default ActiveSearchDisplay;