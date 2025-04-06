import { MachineIssue } from "@/data/types/machineIssues";
import ToggleableItem from "../Users/toggleable-item";

export default function MachineIssueComponent({ issue }: { issue: MachineIssue }) {
  return (
    <ToggleableItem
        title={issue.machine.name}
        subtitle={`Reported by: ${issue.user.name} (${issue.user.JHED})`}
        details={[
            { label: "Reported At", value: new Date(issue.reportedAt).toLocaleString() },
            { label: "Resolved", value: issue.resolved ? "Yes" : "No" }
        ]}
        dataCy={`machine-issue-${issue.id}`}
    />
  );
}
