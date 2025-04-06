import { Button } from "@/components/ui/button";
  import { useState } from "react";
  import useMutationMachineIssue from "@/hooks/use-mutation-machineIssue";
  import { MachineIssue } from "@/data/types/machineIssues";
  import { Circle } from "lucide-react"; // ✅ Icon
import useQueryMachineIssues from "@/hooks/use-query-machine-issues";
import { useStore } from "@nanostores/react";
import { $current_page } from "@/data/store";
  
  type MachineIssueActionsProps = {
    issue: MachineIssue;
  };
  
  export default function MachineIssueActions({ issue }: MachineIssueActionsProps) {
    const { resolveIssue } = useMutationMachineIssue();
    const page = useStore($current_page)
    const {loadMachineIssues} = useQueryMachineIssues(false);
    const [resolving, setResolving] = useState(false);
  
    const handleResolve = async (e: React.MouseEvent) => {
      e.stopPropagation();
      setResolving(true);
      await resolveIssue(issue.id);
      await loadMachineIssues(undefined, page, undefined, undefined);
      setResolving(false);
    };
  
    return (
      <div data-cy={`machine-issue-actions-${issue.id}`} className="flex items-center gap-1">
        
        <Button
          onClick={handleResolve}
          variant="ghost"
          disabled={issue.resolved}
          data-cy={`machine-issue-resolve-${issue.id}`}
        >
          {resolving ? "Resolving..." : "Mark Resolved"}
        </Button>
      
        <Circle
          size={12}
          className={issue.resolved ? "text-green-500" : "text-yellow-500"}
          fill={issue.resolved ? "currentColor" : "currentColor"}
        />
      </div>
    );
  }
  