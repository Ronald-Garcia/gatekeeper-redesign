import { toast } from "sonner";
import { createMachineIssue, updateMachineIssue } from "@/data/api";
import { MachineIssue } from "@/data/types/machineIssues";

function useMutationMachineIssue() {
  const reportIssue = async (userId: number, machineId: number): Promise<MachineIssue | undefined> => {
    try {
      const { data } = await createMachineIssue(userId, machineId);
      toast.success("Maintenance issue reported successfully!");
      return data;
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast.error("Failed to report maintenance issue 😞", {
        description: errorMessage,
      });
      return undefined;
    }
  };

  const resolveIssue = async (issueId: number): Promise<MachineIssue | undefined> => {
    try {
      const { data } = await updateMachineIssue(issueId, 1); // resolved = 1
      toast.success("Issue marked as resolved ✅");
      return data;
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast.error("Failed to mark issue resolved ❌", {
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
