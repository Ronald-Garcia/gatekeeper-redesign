import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useStore } from "@nanostores/react";
import { $router } from "@/data/router";
import { setPagePag } from "@/data/store";
import {
  $gradYearFilter,
  $userBudgetFilter,
  $machineTypeFilter,
  $budgetTypeFilter,
} from "@/data/store";
import useQueryUsers from "@/hooks/use-query-users";
import useQueryMachines from "@/hooks/use-query-machines";
import useQueryBudgets from "@/hooks/use-query-budgetCodes";
import { filterConfigMap, FilterQueries } from "@/data/types/filter";

type Props = {
  filters: FilterQueries[];
};

const GeneralizedFilter: React.FC<Props> = ({ filters }) => {
  const router = useStore($router);

  const { loadUsers } = useQueryUsers(false);
  const { loadMachines, loadMachineTypes } = useQueryMachines(false);
  const { loadBudgets, loadBudgetCodeType } = useQueryBudgets(false);

  const gradYear    = useStore($gradYearFilter);
  const userBudget  = useStore($userBudgetFilter);
  const machineType = useStore($machineTypeFilter);
  const budgetType  = useStore($budgetTypeFilter);

  //load options from other stores by querying db
  useEffect(() => {
    if (filters.includes("machineTypeId")) {
      loadMachineTypes();
    }
    if (filters.includes("budgetCodeId")) {
      loadBudgets();
    }
    if (filters.includes("budgetTypeId")) {
      loadBudgetCodeType();
    }
  }, []);

  //whenever any filter store changes, reset to page 1 and reload
  useEffect(() => {
    if (!router) return;       
    setPagePag(1);
    switch (router.route) {
      case "users":
        loadUsers(undefined, 1);
        break;
      case "budgetCodes":
        loadBudgets(undefined, 1);
        break;
      case "machines":
        loadMachines(undefined, 1);
        break;
    }
  }, [gradYear, userBudget, machineType, budgetType]);

  //local state for the checkboxes inside the dialog
  const [localFilters, setLocalFilters] = useState<Record<string, Set<number>>>(
    {}
  );

  //sync localFilters from the stores whenever prop changes
  useEffect(() => {
    const initial: Record<string, Set<number>> = {};
    for (const key of filters) {
      const storeVal = filterConfigMap[key].store.get();
      initial[key] = new Set(
        Array.isArray(storeVal)
          ? storeVal
          : typeof storeVal === "number"
          ? [storeVal]
          : []
      );
    }
    setLocalFilters(initial);
  }, [filters]);

  const toggleCheckbox = (key: string, val: number) => {
    setLocalFilters((prev) => {
      const next = new Set(prev[key]);
      if (next.has(val)) next.delete(val);
      else next.add(val);
      return { ...prev, [key]: next };
    });
  };

  // set nanostores
  const applyFilters = () => {
    for (const key of filters) {
      const vals = localFilters[key];
      const store = filterConfigMap[key].store;
      if (!vals || vals.size === 0) {
        store.set(null);
        // if multi is true then its a filter
      } else if (filterConfigMap[key].multi) {
        store.set([...vals]);
        //its a sort otherwise, just set once
      } else {
        store.set([...vals][0]);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-[40px]" variant="outline" data-cy="filter-trigger">
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md max-h-[90vh] p-6 flex flex-col">
      <DialogHeader>
        <DialogTitle>
          Filter your search.
        </DialogTitle>
        <DialogDescription>
          Choose your optional filters.
        </DialogDescription>

      </DialogHeader>

        <div className="space-y-4">
          {filters.map((key) => {
            const { label, getOptions } = filterConfigMap[key];
            const options = getOptions();
            const selected = localFilters[key] || new Set<number>();

            return (
              <div key={key}>
                <p className="text-sm font-bold">{label}</p>
                <div className="space-y-1 overflow-y-auto max-h-48">
                  {options.map((opt) => {
                    const val =
                      typeof opt.value === "object" ? opt.value.id : opt.value;
                    return (
                      <label
                        key={val}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          data-cy={`box-${opt.label}`}
                          type="checkbox"
                          checked={selected.has(val)}
                          onChange={() => toggleCheckbox(key, val)}
                        />
                        <span>{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end pt-4">
          <DialogClose asChild>
            <Button onClick={applyFilters} data-cy="apply-filters">
              Apply Filters
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GeneralizedFilter;
