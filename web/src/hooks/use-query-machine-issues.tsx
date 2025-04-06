import { getMachineIssues } from "@/data/api";
import { $machine_issues } from "@/data/store";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

function useQueryMachineIssues(reload: boolean) {
  const machineIssues = useStore($machine_issues);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadMachineIssues = async (
    sort: "asc" | "desc" = "desc",
    page: number = 1,
    limit: number = 10,
    resolved: number = 0
  ) => {
    try {
      setIsLoading(true);
      const { data } = await getMachineIssues(sort, page, limit, resolved);

      // Transform response to match frontend expected shape
      const formatted = data.map((issue) => ({
        id: issue.id,
        userId: issue.userId,
        machineId: issue.machineId,
        reportedAt: new Date(issue.reportedAt),
        resolved: issue.resolved,
      }));

      $machine_issues.set(formatted);
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
