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
  
  type MachineIssueActionsProps = {
    issue: MachineIssue;
  };
  
  export default function MachineIssueActions({ issue }: MachineIssueActionsProps) {
    const { resolveIssue } = useMutationMachineIssue();
    const [resolving, setResolving] = useState(false);
  
    const handleResolve = async (e: React.MouseEvent) => {
      e.stopPropagation();
      setResolving(true);
      const updated = await resolveIssue(issue.id);
      if (updated) {
        window.location.reload(); // Or replace with better refetch logic if available
      }
      setResolving(false);
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
  