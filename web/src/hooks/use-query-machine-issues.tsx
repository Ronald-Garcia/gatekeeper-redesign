import { getMachineIssues } from "@/data/api";
import { $machine_issues } from "@/data/store";
import {
  setMetaData,
  set_has_more_pag,
} from "@/data/store";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";
import { MachineIssue } from "@/data/types/machineIssues";

function useQueryMachineIssues(reload: boolean) {
  const machineIssues = useStore($machine_issues);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadMachineIssues = async (
    sort: "asc" | "desc" = "desc",
    page: number = 1,
    limit: number = 10,
    search: string = "", // Placeholder if needed later
    resolved: number = 0
  ) => {
    try {
      setIsLoading(true);

      const { data } = await getMachineIssues(sort, page, limit, resolved);

      const formatted: MachineIssue[] = data.map((issue) => ({
        ...issue,
        reportedAt: new Date(issue.reportedAt),
      }));

      $machine_issues.set(formatted);

      // ✅ Fallback pagination logic (if no `meta` is returned from API)
      const hasMore = data.length === limit;
      const estimatedTotal = hasMore ? page * limit + 1 : page * limit;

      set_has_more_pag(hasMore);
      setMetaData({
        page,
        limit,
        total: estimatedTotal,
      });
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Failed to fetch machine issues",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (reload) {
      loadMachineIssues();
    }
  }, []);

  return {
    machineIssues,
    loadMachineIssues,
    isLoading,
  };
}

export default useQueryMachineIssues;
