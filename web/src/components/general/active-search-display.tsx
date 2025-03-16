import { $activeSearch, resetSearch } from "@/data/store";
import { useStore } from "@nanostores/react";
import { Button } from "../ui/button";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import useQueryUsers from "@/hooks/use-query-users";
import useQueryBudgets from "@/hooks/use-query-budgetCodes";
import { $router } from "@/data/router";


//Component that displays active search, and when clicking x on it, clears the active search.
const ActiveSearchDisplay = () => {
    //Our loaders.
    const { loadUsers } = useQueryUsers(false);
    const { loadBudgets } = useQueryBudgets(false);
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
            default:
        }
    }
    if (activeSearch !== "") {
    return(
    <div className="search-query-container">
        <span className="search-query" >{activeSearch}</span>
            <Button data-cy="clear-search-button" variant={"ghost"} onClick={deleteSearch}>
                <CrossCircledIcon/>
            </Button>
    </div>
    )
    }
};
export default ActiveSearchDisplay;