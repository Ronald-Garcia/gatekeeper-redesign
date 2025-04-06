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
      
          // ✅ Manually merge back the user and machine data
          const fixed: MachineIssue = {
            ...updated,
            user: issue.user,
            machine: issue.machine,
            resolved: Number(updated.resolved) === 1, // convert number to boolean if needed
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
      <div data-cy={`machine-issue-actions-${issue.id}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="absolute top-2 right-2 deck-actions"
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
  