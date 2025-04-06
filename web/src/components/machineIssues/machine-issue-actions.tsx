import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
  } from "@/components/ui/dropdown-menu";
  import { Button } from "@/components/ui/button";
  import { useState } from "react";
  import useMutationMachineIssue from "@/hooks/use-mutation-machineIssue";
  import { MachineIssue } from "@/data/types/machineIssues";
  import { $machine_issues } from "@/data/store";
  import { toast } from "sonner";
  import { Circle } from "lucide-react"; // ✅ Icon
  
  type MachineIssueActionsProps = {
    issue: MachineIssue;
  };
  
  export default function MachineIssueActions({ issue }: MachineIssueActionsProps) {
    const { resolveIssue } = useMutationMachineIssue();
    const [resolving, setResolving] = useState(false);
  
    const handleResolve = async (e: React.MouseEvent) => {
      e.stopPropagation();
      setResolving(true);
  
      try {
        const updated = await resolveIssue(issue.id);
  
        if (!updated) {
          toast.error("Failed to update issue.");
          return;
        }
  
        const fixed: MachineIssue = {
          ...updated,
          user: issue.user,
          machine: issue.machine,
          resolved: Number(updated.resolved) === 1,
        };
  
        const current = $machine_issues.get();
        const updatedList = current.map((i) => (i.id === fixed.id ? fixed : i));
        $machine_issues.set(updatedList);
  
        toast.success("Issue marked as resolved ✅");
      } catch (error) {
        console.error("Resolve failed:", error);
        toast.error("Something went wrong.");
      } finally {
        setResolving(false);
      }
    };
  
    return (
      <div data-cy={`machine-issue-actions-${issue.id}`} className="flex items-center gap-1">
        <Circle
          size={12}
          className={issue.resolved ? "text-green-500" : "text-yellow-500"}
          fill={issue.resolved ? "currentColor" : "currentColor"}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="deck-actions"
              data-cy={`machine-issue-trigger-${issue.id}`}
            >
              ...
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {!issue.resolved && (
              <DropdownMenuItem
                onClick={handleResolve}
                className="text-green-600"
                disabled={resolving}
                data-cy={`machine-issue-resolve-${issue.id}`}
              >
                {resolving ? "Resolving..." : "Mark Resolved"}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
  