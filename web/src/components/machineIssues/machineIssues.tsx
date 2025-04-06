import { $machine_issues } from "@/data/store";
import { useStore } from "@nanostores/react";
import useQueryMachineIssues from "@/hooks/use-query-machine-issues";
import MachineIssueComponent from "./machineIssue";

export default function MachineIssues() {
  const issueList = useStore($machine_issues);
  
  // Ensure machine issues load when component mounts
  useQueryMachineIssues(true);

  return (
    <div className="p-4">
      {issueList.length === 0 ? (
        <p data-cy="no-issues">No machine issues!</p>
      ) : (
        <div className="space-y-4">
          {issueList.map((issue) => (
            <MachineIssueComponent key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}
