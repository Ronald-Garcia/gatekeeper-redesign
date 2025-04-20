export type MachineIssue = {
  id: number;
  reportedAt: Date | string;
  resolved: boolean;
  description: string; 
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
