import { MachineIssue } from "@/data/types/machineIssues";
import ToggleableItem from "../Users/toggleable-item";

export default function MachineIssueComponent({ issue }: { issue: MachineIssue }) {
  return (
    <ToggleableItem
      title={`Machine ID: ${issue.machineId}`}
      subtitle={`Reported by User ID: ${issue.userId}`}
      details={[
        { label: "Reported At", value: new Date(issue.reportedAt).toLocaleString() },
        { label: "Resolved", value: issue.resolved ? "Yes" : "No" }
      ]}
      dataCy={`machine-issue-${issue.id}`}
    />
  );
}
