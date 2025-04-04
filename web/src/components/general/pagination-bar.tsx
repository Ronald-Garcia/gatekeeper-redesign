import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import { $current_page, $max_page, $total } from "@/data/store";
import useQueryMachines from "@/hooks/use-query-machines";
import { useStore } from "@nanostores/react";


const Pagination_bar = () => {
  
    // const {validate_session} = useValidate();
    // validate_session();
    const {loadMachines} = useQueryMachines(false);

    const curPage = useStore($current_page);
    const totalEntries = useStore($total);
    const maxPage = useStore($max_page);

    const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
        const page_num = Number(e.currentTarget.id);
        console.log(Number(e.currentTarget.id));

        if (page_num > totalEntries) {
            return
        }
        loadMachines(undefined, page_num, undefined, undefined);
    };  

    const handleClickBack = (_: React.MouseEvent<HTMLLIElement>) => {
        const page_num = curPage - 1;
        if (page_num <= 0) {
        return
        }
        loadMachines(undefined, page_num, undefined, undefined);
    };

    const handleClickNext = (_: React.MouseEvent<HTMLLIElement>) => {
        const page_num = curPage + 1;
        if (page_num > maxPage) {
        return
        }
        loadMachines(undefined, page_num, undefined, undefined);
    };

    const prevprevEleId = curPage - 2
    const prevEleId = curPage - 1
    const curEleId = curPage
    const secondEleId = curPage + 1
    const thirdEleId = curPage + 2

    return (
        <Pagination>
        <PaginationContent>
            
            <PaginationItem onClick={handleClickBack}>
            <PaginationPrevious/>
            </PaginationItem>

            {(curEleId - 3) >= 1 && (
            <PaginationItem id = {"1"} onClick={handleClick}>
                {1}
            </PaginationItem>
            )}
            {(curEleId - 3) >= 1 && (
            <PaginationItem>
                <PaginationEllipsis />
            </PaginationItem>
            )}
        {prevprevEleId > 0 && (
            <PaginationItem id = {`${prevprevEleId}`} onClick={handleClick}>
                <PaginationLink href="#">
                    {prevprevEleId}
                </PaginationLink>
            </PaginationItem>
        )}
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
            {thirdEleId <= maxPage && (
                
            <PaginationItem id = {`${thirdEleId}`} onClick={handleClick}>
                <PaginationLink href="#">
                    {thirdEleId}
                </PaginationLink>
            </PaginationItem>
            )}
            {(curEleId + 3) <= maxPage && (
            <PaginationItem>
                <PaginationEllipsis />
            </PaginationItem>
            )}
            {(curEleId + 3) <= maxPage && (
            <PaginationItem id = {`${maxPage}`} onClick={handleClick}>
                <PaginationLink href="#">
                    {maxPage}
                </PaginationLink>
            </PaginationItem>
            )}
            <PaginationItem onClick={handleClickNext}>
            <PaginationNext />
            </PaginationItem>
        </PaginationContent>
        </Pagination>
    );
    };
    
    export default Pagination_bar;