import { getMachineIssues } from "@/data/api";
import { $machine_issues } from "@/data/store";
import {
  setMetaData,
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
  ) => {
    // search: string = "", // Placeholder if needed later
    // resolved?: number


    try {
      setIsLoading(true);

      const { data, meta } = await getMachineIssues(sort, page, limit);

      const formatted: MachineIssue[] = data.map((issue: MachineIssue) => ({
        ...issue,
        reportedAt: new Date(issue.reportedAt),
      }));

      $machine_issues.set(formatted);

      // ✅ Fallback pagination logic (if no `meta` is returned from API)

      setMetaData(meta);
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
