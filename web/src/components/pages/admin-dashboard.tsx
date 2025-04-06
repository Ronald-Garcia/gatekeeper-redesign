import { $router } from "@/data/router";
import { useStore } from "@nanostores/react";
import BudgetCodes from "../BudgetCodes/budgetCodes";
import UsersActions from "./user-actions";
import BudgetActions from "./budget-actions";
import Sidebar from "../layout/sidebar";
import MachineActions from "./machine-actions";
import MachinesComponent from "../machines/machines-component";
import InactiveTab from "../general/inactive-tab";
import { ScrollArea } from "../ui/scroll-area";
import PaginationBar from "../general/pagination-bar";
import useQueryMachines from "@/hooks/use-query-machines";
import { SearchQuerySorts } from "@/data/types/sort";
import useQueryUsers from "@/hooks/use-query-users";
import useQueryBudgets from "@/hooks/use-query-budgetCodes";
import { $activeSearch } from "@/data/store";
import Users from "../Users/users";
import FinancialStatements from "../financialStatements/financialStatements";
import useQueryStatements from "@/hooks/use-financialStatements-hook";

/*
Admin dashboard component
Displays BudgetCodes or Users based on routing. 
*/
const AdminDashboard = () => {
  const router = useStore($router);

  //Bunch of functions that we cast to the generalized loading function type to pass to pagination.
  const {loadUsers} = useQueryUsers(false);
  const userLoadFunction = loadUsers as (sort?: SearchQuerySorts, page?: number, limit?: number, search?: string) => void

  const {loadBudgets} = useQueryBudgets(false);
  const budgetLoadFunction = loadBudgets as (sort?: SearchQuerySorts, page?: number, limit?: number, search?: string) => void

  const {loadMachines} = useQueryMachines(false);
  const machineLoadFunction = loadMachines as (sort?: SearchQuerySorts, page?: number, limit?: number, search?: string) => void
  
  const {loadFinancialStatements} = useQueryStatements(false);
  const financialStatementLoadFunction = loadFinancialStatements as (sort?: SearchQuerySorts, page?: number, limit?: number, search?: string) => void

  const activeSearch = useStore($activeSearch);

  if (!router) {
    return (
      <>
        <div>
        </div>
      </>
    )
  }
  if (router.route === "users") {
    return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <UsersActions/>
        <InactiveTab/>
        <ScrollArea className={`${activeSearch ? 'scroll-component-search' : 'scroll-component'}`}>

          <Users/>
        </ScrollArea>
        <PaginationBar loadFunction={userLoadFunction}/>

      </div>
    </div>
    )
  } else if (router.route === "budgetCodes"){
    return(
    <div className="flex">
      <Sidebar />
      <div className="admin-dashboard">
        <BudgetActions/>
        <InactiveTab />
        <ScrollArea className={`${activeSearch ? 'scroll-component-search' : 'scroll-component'}`}>
          <BudgetCodes/>
        </ScrollArea>
        <PaginationBar loadFunction={budgetLoadFunction}/>

      </div>
    </div>
    )
  } else if (router.route === "machines"){
    return(
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
        <MachineActions/>
        <InactiveTab/>
        <ScrollArea className={`${activeSearch ? 'scroll-component-search' : 'scroll-component'}`}>
        <MachinesComponent/>
        </ScrollArea>
        <PaginationBar loadFunction={machineLoadFunction}/>

        </div>
      </div>
      )
  } else if (router.route === "financial_statements"){
    return(
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <ScrollArea className={`${activeSearch ? 'scroll-component-search-fin' : 'scroll-component-fin'}`}>
            <FinancialStatements/>
          </ScrollArea>
          <PaginationBar loadFunction={financialStatementLoadFunction}/>
        </div>
      </div>
    )
  }
};

export default AdminDashboard;
