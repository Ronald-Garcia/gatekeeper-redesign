import { toast } from "sonner";
import { createMachineIssue } from "@/data/api";
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

  return {
    reportIssue,
  };
}

export default useMutationMachineIssue;
