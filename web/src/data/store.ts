import { User } from "./types/user";
import { atom, map } from "nanostores";
import { BudgetCode, budgetCodeType } from "./types/budgetCode"; 
import { Machine } from "./types/machine";
import { MachineType } from "./types/machineType";
import { financialStatement } from "./types/financialStatement";
import { MachineIssue } from "./types/machineIssues"
import { logger } from "@nanostores/logger"
import { DateRange } from "react-day-picker";
import { MetaType } from "./types/meta";
import { userBudgetStats, userMachinesStats, userStats } from "./types/user-stats";
import { PrecisionType } from "./types/precision-type";

const defaultDateRange: DateRange = {
  from: new Date( (new Date()).getFullYear() - ((new Date()).getMonth() === 0 ? 1 : 0) , (new Date()).getMonth() - 1, (new Date()).getDate()), 
  to: new Date()
}

export const $users = atom<User[]>([]);
export const $codes = atom<BudgetCode[]>([]);
export const $machines = atom<Machine[]>([]);
export const $machine_types = atom<MachineType[]>([]);
export const $budget_code_queue = atom<number[]>([]);
export const $training_queue = atom<number[]>([]);
export const $date_range = atom<DateRange>(defaultDateRange);
export const $date = atom<Date>(new Date());
export const $hasMoreUserBudgets = atom<boolean>(false);
export const $hasMoreUserTrainings = atom<boolean>(false);
export const $currentPage = atom<number>(1);
export const $activeTab = atom<number>(1);
export const $machine_issues = atom<MachineIssue[]>([]);
export const $userTotalChart = atom<userStats[]>([]);
export const $userBudgetChart = atom<userBudgetStats[]>([]);
export const $userMachineChart = atom<userMachinesStats[]>([]);
export const $filtered_total_chart = atom<userStats[]>([]);
export const $filtered_budget_chart = atom<userBudgetStats[]>([]);
export const $filtered_machine_chart = atom<userMachinesStats[]>([]);
export const $precision = atom<PrecisionType>("d")


export function setPrecision(p: PrecisionType)  {
  $precision.set(p);
}

export function clearPrecision() {
  $precision.set("d");
}


export function addFunctionToMachineChart(func: userMachinesStats) {
  if ($filtered_machine_chart.get().some(d => d.machineType === func.machineType)) {
    return;
  }
  $filtered_machine_chart.set([...$filtered_machine_chart.get(), func])
}
export function addFunctionToBudgetChart(func: userBudgetStats) {
  if ($filtered_budget_chart.get().some(d => d.budgetCode === func.budgetCode)) {
    return;
  }
  $filtered_budget_chart.set([...$filtered_budget_chart.get(), func])
}

export function setMachineIssues(issues: MachineIssue[]) {
  $machine_issues.set(issues);
}
export function resetMachineIssues() {
  $machine_issues.set([]);
}
export const $budgetCodeTypes = atom<budgetCodeType[]>([]);

export function clearFilteredBudgetChart() {
  $filtered_budget_chart.set([]);
}
export function clearFilteredMachineChart() {
  $filtered_machine_chart.set([]);
}
export function clearFilteredTotalChart() {
  $filtered_total_chart.set([]);
}

export function clearBudgetChart() {
  $userBudgetChart.set([]);
}
export function clearMachineChart() {
  $userMachineChart.set([]);
}
export function clearTotalChart() {
  $userTotalChart.set([]);
}

export function setActiveTab(tab: number) {
  $activeTab.set(tab);
}

export function setPage(p: number) {
  $currentPage.set(p);
}

export function incrementPage() {
  $currentPage.set($currentPage.get() + 1);
}

export function decrementPage() {
  $currentPage.set($currentPage.get() - 1);
}

export function setHasMoreUserBudgets(hasMore: boolean) {
  $hasMoreUserBudgets.set(hasMore);
}

export function setHasMoreUserTrainings(hasMore: boolean) {
  $hasMoreUserTrainings.set(hasMore);
}


export function setDate(date: Date) {
  $date.set(date);
}

export function resetDate() {
  $date.set(new Date());
}

export function setDateRange(dateRange: DateRange) {
  $date_range.set(dateRange);
}

export function resetDateRange() {
  $date_range.set(defaultDateRange);
}

export function setBudgetCodeQueue(bcs: number[]) {
  $budget_code_queue.set(bcs);
}

export function addBudgetCodeQueue(bc: number) {
  $budget_code_queue.set([...$budget_code_queue.get(), bc]);
}

export function removeBudgetCodeQueue(bc: number) {
  $budget_code_queue.set($budget_code_queue.get().filter(b => b !== bc));
}

export function clearBudgetCodeQueue() {
  $budget_code_queue.set([]);
}

export function toggleBudgetCodeQueue(bc: number) {
  const bcs =  $budget_code_queue.get();
  const hasBc = bcs.some(b => b === bc);
  if (hasBc) {
    removeBudgetCodeQueue(bc);
  } else {
    addBudgetCodeQueue(bc);
  }
}

export function addNewBudgetCodeTypes(type: budgetCodeType) {
  $budgetCodeTypes.set([...$budgetCodeTypes.get(), type]);
}

export function setTrainingQueue(bcs: number[]) {
  $training_queue.set(bcs);
}

export function addTrainingQueue(bc: number) {
  $training_queue.set([...$training_queue.get(), bc]);
}



export function removeTrainingQueue(bc: number) {
  $training_queue.set($training_queue.get().filter(b => b !== bc));
}

export function clearTrainingQueue() {
  $training_queue.set([]);
}

export function toggleMachineTypeQueue(bc: number) {
  clearTrainingQueue();
  const bcs =  $training_queue.get();
  const hasBc = bcs.some(b => b === bc);
  if (hasBc) {
    removeTrainingQueue(bc);
  } else {
    addTrainingQueue(bc);
  }
}


export function toggleTrainingQueue(bc: number) {
  const bcs =  $training_queue.get();
  const hasBc = bcs.some(b => b === bc);
  if (hasBc) {
    removeTrainingQueue(bc);
  } else {
    addTrainingQueue(bc);
  }
}





// export function addSelectedBudgetCode(bc: number) {
//   $budget_code_queue.set([...$budget_code_queue.get(), bc ]);
// }

// export function removeSelectedBudgetCode(bc: number) {
//   $budget_code_queue.set($budget_code_queue.get().filter(b => b !== bc));
// }

// export function clearSelectedBudgetCode() {
//   $budget_code_queue.set([]);
// }

// export function toggleSelectedBudgetCode(bc: number) {
//   const sbc = $budget_code_queue.get().find(b => b === bc);

//   if (sbc) {
//     removeSelectedBudgetCode(bc);
//   } else {
//     addSelectedBudgetCode(bc);
//   }
// }

// export function setSelectedBudgetCode(bcs: number[]) {
//   $budget_code_queue.set(bcs);
// }

const defaultUser: User = {
  name: "test",
  cardNum: "-1",
  lastDigitOfCardNum: -1,
  isAdmin: 0,
  graduationYear: 2020,
  JHED: "ttest01",
  id: -1,
  active: 0
}

const defaultMachine: Machine = {
  id: -1,
  name: "invalid",
  machineType: {
    id: -1,
    name: ""
  },
  hourlyRate: 0,
  active:-1,
  lastTimeUsed: "",
}

const defaultBudget: BudgetCode = {
  id: -1,
  name: "invalid",
  code: "invalid",
  type: {
    id: -1,
    name: ""
  },
  active: 0
}


export const $kiosk = atom<boolean>(false);

export function setKiosk(isKiosk: boolean) {
  $kiosk.set(isKiosk);
}

export const $currentUser = map<User>(defaultUser);
export const $currentMachine = map<Machine>(defaultMachine);
export const $currentBudget = map<BudgetCode>(defaultBudget);

export function validCurrentUser() {
  return $currentUser.get() !== defaultUser;
}

export function validCurrentBudget() {
  return $currentBudget.get() !== defaultBudget;
}

export function setCurrentBudget(budget: BudgetCode) {
  $currentBudget.set(budget);
}

export function clearCurrentBudget() {
  $currentBudget.set(defaultBudget)
}

export function adminCurrentUser() {
  return $currentUser.get().isAdmin;
}


export function setCurrentUser(user: User) {
  $currentUser.set(user);
}


export function clearCurrentUser() {
  $currentUser.set(defaultUser);
}


export function addUser(user: User) {
  $users.set([...$users.get(), user]);
}

export function deleteUserById(id: number) {
  $users.set($users.get().filter((user: User) => user.id !== id));
}

export function addTraining(id: number) {
  $users.set($users.get().filter((user: User) => user.id !== id));
}

export function setUsers(userList: User[]) {
  $users.set(userList);
}


// //logic to update user
export function updateUserById(updatedUser: User) {
  $users.set(
    $users.get().map((user: User) =>
      user.id === updatedUser.id ? updatedUser : user
    )
  );
 }



//machine state funcitons 


export function validCurrentMachine() {
  return $currentMachine.get() !== defaultMachine || $kiosk.get();
}

export function setCurrentMachine(machine: Machine) {
  $currentMachine.set(machine);
}


export function clearCurrentMachine() {
  $currentMachine.set(defaultMachine);
}

 //budget code store functions 
export function setBudgetCodes(codeList: BudgetCode[]) {
  $codes.set(codeList);
}

export function appendBudgetCodes(codeList: BudgetCode[]) {
  $codes.set([...$codes.get(), ...codeList]);
}

export function addBudgetCode(code: BudgetCode) {
  $codes.set([...$codes.get(), code]);
}

export function deleteBudgetCodeById(id: number) {
  $codes.set(
    $codes.get().filter((code: BudgetCode) => code.id !== id)
  );
}

export function deleteBudgetCodeByNum(codeNum: string) {
  $codes.set(
    $codes.get().filter((code: BudgetCode) => code.code !== codeNum),
  );
}

//machine store functions 
export function appendMachine(machine: Machine) {
  $machines.set(
    [...$machines.get(), machine]
  )
}

export function removeMachine(id: number) {
  $machines.set(
    $machines.get().filter(m => m.id !== id)
  );
}

export function setMachines(machines: Machine[]) {
  $machines.set(machines);
}


export const $machine = atom<Machine>(defaultMachine);
//This is for when you need to set a single machine for something like a the form page.
export function setMachine(machine: Machine) {
  $machine.set(machine);
}

export function clearMachines() {
  $machines.set([]);
}


//machine type functions 

export function addNewMachineType(type: MachineType) {
  $machine_types.set([...$machine_types.get(), type]);
}

export function deleteOldMachineType(id: number) {
  $machine_types.set(
    $machine_types.get().filter(m => m.id !== id)
  );
}

export function setMachinesTypes(typeList: MachineType[]) {
  $machine_types.set(typeList);
}

export function appendMachineTypes(typeList: MachineType[]) {
  $machine_types.set([...$machine_types.get(), ...typeList]);
}


export function setBudgetCodeTypes(typeList: budgetCodeType[]) {
  $budgetCodeTypes.set(typeList);
}

export function appendBudgetCodeType(typeList: budgetCodeType[]) {
  $budgetCodeTypes.set([...$budgetCodeTypes.get(), ...typeList]);
}


// *** SERACH STORES ***

//The "local" search for a user, aka state control of the search bar.
export const $localSearch = atom<string>("")
export function setLocalSearch(newLocalSearch: string) {
  $localSearch.set(newLocalSearch)
}

// The active search for a user, budget code, machine, etc entered into the main search bar.
export const $activeSearch = atom<string>("")
export function setActiveSearch(newSearch: string) {
  $activeSearch.set(newSearch)
}

// Reset both the search bar and active search.
export function resetSearch() {
  $localSearch.set("")
  $activeSearch.set("")
}

// filter stores 
export const $gradYearFilter = atom<number []| null>(null);
export const $userBudgetFilter = atom<number []| null>(null);
export const $machineTypeFilter = atom<number []| null>(null);
export const $userMachineFilter = atom<number []| null>(null);
export const $budgetTypeFilter = atom<number []| null>(null);
export const $gradYears = atom<number[]>([]);

export function setYearFilter(year: number[]) {
  $gradYearFilter.set(year);
}

export function setYears(year: number[]) {
  $gradYears.set(year);
}

export function setUserMachineFilter(machine: number[]) {
  $userMachineFilter.set(machine);
}
 
export function setBudgetFilter(budget: number[]) {
  $userBudgetFilter.set(budget);
}

export function clearYearFilter() {
  $gradYearFilter.set(null);

}

export function clearUserMachineFilter() {
  $userMachineFilter.set(null);
}

export function clearBudgetFilter() {
  $userBudgetFilter.set(null);
}

export function setMachineTypeFilter(type: number[]) {
  $machineTypeFilter.set(type);

}


export function clearMachineTypeFilter() {
  $machineTypeFilter.set(null);
}

export function setBudgetTypeFilter(type: number[]) {
  $budgetTypeFilter.set(type);
}

export function clearBudgetTypeFilter() {
  $budgetTypeFilter.set(null);
}

export function clearFilters(){
  clearBudgetTypeFilter();
  clearMachineTypeFilter();
  clearYearFilter();
  clearBudgetFilter();
  clearUserMachineFilter();
}
export const $statements = atom<financialStatement[]>([]);
export function setFinancialStatements(statements: financialStatement[]) {
  $statements.set(statements);
}

export const $curStatementId = atom<number>(-1);
export function setCurStatement(id:number) {
  $curStatementId.set(id);
}

logger({ $budget_code_queue })
export const $curbudgets = atom<BudgetCode[]>([])
export function setCurBudgets(newBudgetCodes: BudgetCode[]) {
  $curbudgets.set(newBudgetCodes)
}

export const $curtrainings = atom<MachineType[]>([])
export function setCurTrainings(newTrainings: MachineType[]) {
  $curtrainings.set(newTrainings)
}

export const $dashboardActiveSearch = atom("");
export function setDashboardActiveSearch(search: string) {
  $dashboardActiveSearch.set(search);
}

export const $dashboardLocalSearch = atom("");
export function setDashboardLocalSearch(search: string) {
  $dashboardLocalSearch.set(search);
}

export function resetDashboardSearch() {
  setDashboardActiveSearch("");
  setDashboardLocalSearch("");
}

// Pagination stores

export function setMetaData(data: MetaType) {
  // Set all the things for pagination.
  setLimit(data.limit);
  setPagePag(data.page);
  setTotal(data.total);

  setMaxPage(Math.ceil(data.total / data.limit));
}

export const $current_page = atom<number>(1);
export function setPagePag(page: number) {
  $current_page.set(page);
}

export function decrementPagePag() {
  $current_page.set($current_page.get() - 1);
}

export const $has_more_pag = atom(true);
export function set_has_more_pag(hasMore: boolean) {
  $has_more_pag.set(hasMore);
}

export const $limit = atom<number>(0);
export function setLimit(limit: number) {
  $limit.set(limit);
}

export const $total = atom<number>(0);
export function setTotal(total: number) {
  $total.set(total);
}

export function setTotalChartData(data: userStats[]) {
  $userTotalChart.set(data);
}
export function setBudgetChartData(data: userBudgetStats[]) {
  $userBudgetChart.set(data);
}
export function setMachineChartData(data: userMachinesStats[]) {
  $userMachineChart.set(data);
}
export function setFilteredTotalChartData(data: userStats[]) {
  $filtered_total_chart.set(data);
}
export function setFilteredBudgetChartData(data: userBudgetStats[]) {
  $filtered_budget_chart.set(data);
}
export function setFilteredMachineChartData(data: userMachinesStats[]) {
  $filtered_machine_chart.set(data);
}

export function resetTotalChartData() {
  $userTotalChart.set([]);
}
export function resetBudgetChartData() {
  $userBudgetChart.set([]);
}
export function resetMachineChartData() {
  $userMachineChart.set([]);
}

export const $max_page = atom<number>(1);
export function setMaxPage(max_page: number) {
  $max_page.set(max_page);
}
logger({ $activeTab, $users })

export const $mix_active = atom<boolean>(false);
export function setMixActive(status: boolean) {
  $mix_active.set(status);
}

export function resetStores() {
  resetDashboardSearch();
  resetDate();
  resetDateRange();
  resetSearch();
  clearCurrentUser();
  setMixActive(false);
}

logger({ $currentUser, $filtered_budget_chart })