import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import { $activeSearch, $current_page, $max_page, $total } from "@/data/store";
import { SearchQuerySorts } from "@/data/types/sort";
import { useStore } from "@nanostores/react";

interface PagProps {
    loadFunction: (sort?: SearchQuerySorts, page?: number, limit?: number, search?: string) => void
  }

const PaginationBar = ({loadFunction}: PagProps) => {
  
    // const {validate_session} = useValidate();
    // validate_session();

    const curPage = useStore($current_page);
    const totalEntries = useStore($total);
    const maxPage = useStore($max_page);
    const activeSearch = useStore($activeSearch);

    const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
        const page_num = Number(e.currentTarget.id);

        if (page_num > totalEntries) {
            return
        }
        loadFunction(undefined, page_num, undefined, activeSearch);
    };  

    const handleClickBack = (_: React.MouseEvent<HTMLLIElement>) => {
        const page_num = curPage - 1;
        if (page_num <= 0) {
        return
        }
        loadFunction(undefined, page_num, undefined, activeSearch);
    };

    const handleClickNext = (_: React.MouseEvent<HTMLLIElement>) => {
        const page_num = curPage + 1;
        if (page_num > maxPage) {
        return
        }
        loadFunction(undefined, page_num, undefined, undefined);
    };


    const prevEleId = curPage - 1
    const curEleId = curPage
    const secondEleId = curPage + 1

    //If its less then 7, just show all of them.
    return (
        <Pagination>
        <PaginationContent>
            
            <PaginationItem onClick={handleClickBack}>
            <PaginationPrevious href="#"/>
            </PaginationItem>
    
    
        {prevEleId > 0 && (
            <PaginationItem id = {`${prevEleId}`} onClick={handleClick}>
                <PaginationLink href="#">
                    {prevEleId}
                </PaginationLink>
            </PaginationItem>
        )}

            <PaginationItem  id = {`${curEleId}`} onClick={handleClick}>
                <PaginationLink href="#" isActive>
                    {curEleId}
                </PaginationLink>
            </PaginationItem>
            {secondEleId <= maxPage && (

            <PaginationItem id = {`${secondEleId}`} onClick={handleClick}>
                <PaginationLink href="#">
                    {secondEleId}
                </PaginationLink>
            </PaginationItem>
            )}


            <PaginationItem onClick={handleClickNext}>
            <PaginationNext href="#"/>
            </PaginationItem>
        </PaginationContent>
        </Pagination>
    )

    
    };
    
    export default PaginationBar;