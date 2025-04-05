export type MachineIssue = {
  id: number;
  userId: number;
  machineId: number;
  reportedAt: Date;
  resolved: boolean;
};
