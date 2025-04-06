import { createMachineIssue, updateMachineIssue } from "@/data/api";
import { MachineIssue } from "@/data/types/machineIssues";
import { toast } from "./use-toast";
import { $machine_issues, setMachineIssues } from "@/data/store";
import { useStore } from "@nanostores/react";
function useMutationMachineIssue() {

  const machineIssues = useStore($machine_issues);
  const reportIssue = async (userId: number, machineId: number): Promise<MachineIssue | undefined> => {
    try {
      const { data } = await createMachineIssue(userId, machineId);
      toast({
        variant: "default",
        title: "Maintenance issue reported successfully!",
        description: "Issue reported successfully!",
      });
      return data;
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "Failed to report maintenance issue 😞",
        description: errorMessage,
      });
      return undefined;
    }
  };

  const resolveIssue = async (issueId: number): Promise<MachineIssue | undefined> => {
    try {
      const { data } = await updateMachineIssue(issueId, 1); // resolved = 1
      toast({
        variant: "default",
        title: "✅ Issue marked as resolved",
        description: "Issue marked as resolved successfully!",
      });

      
      return data;
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Failed to mark issue resolved",
        description: errorMessage || "Unknown error",
      });
      return undefined;
    }
  };
  

  return {
    reportIssue,
    resolveIssue,
  };
}

export default useMutationMachineIssue;
