export type MachineIssue = {
  id: number;
  reportedAt: Date;
  resolved: boolean;
  user: {
    id: number;
    name: string;
    JHED: string;
  };
  machine: {
    id: number;
    name: string;
  };
};
