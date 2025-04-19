import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
  } from "@/components/ui/dropdown-menu";
import { SearchQuerySorts } from "@/data/types/sort"
import { useStore } from "@nanostores/react"


// kinda similar to pagination, but only modifying the active searcg passing that still
//maybe add a filtertypes for this and import them here
export interface FilteringProps<T,S> {
    filterAndSorts: Filt
}


const Filtering = ({loadFunction}:FilteringProps) => {

   

    
    return (
        <div>
        <DropdownMenu>
            <DropdownMenuTrigger  />
                <DropdownMenuContent>
                    <DropdownMenuItem>
                    
                    </DropdownMenuItem>
                </DropdownMenuContent>
        </DropdownMenu>

        </div>
    )
}