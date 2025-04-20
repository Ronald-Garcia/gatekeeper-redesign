import { Button } from "../ui/button";
import { useStore } from "@nanostores/react";
import {
  $gradYearFilter,
  $userBudgetFilter,
  $machineTypeFilter,
  clearFilters,
} from "@/data/store";

export default function ClearFiltering() {
  const gradYear = useStore($gradYearFilter);
  const budget   = useStore($userBudgetFilter);
  const machine  = useStore($machineTypeFilter);

  const hasAny = (gradYear?.length ?? 0) > 0 ||(budget?.length   ?? 0) > 0 ||(machine?.length  ?? 0) > 0;

  if (!hasAny) return null;
  
  return (
    <Button variant="outline" onClick={() => clearFilters()}>
      Clear Filters
    </Button>
  );
}