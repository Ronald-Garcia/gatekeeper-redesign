import { useStore } from "@nanostores/react";
import { $machine_issues } from "@/data/store";
//import MachineIssue from "./machineIssue";
import { ScrollArea } from "@radix-ui/react-scroll-area";
//import useQueryMachineIssues from "@/hooks/use-query-machine-issues";

/*
List of Machine Issues with the machine name and user id with a flag on the right side if
not resolved.
*/

export default function MachineIssue() {
    //useQueryUsers(true);
  
    const machineIssueList = useStore($machine_issues);
  
    return (
        <div className="flex flex-col h-full">
        <ScrollArea className="flex-1">
          <div className="p-4">
              <p data-cy="no-users">No users found!</p>
          </div>
        </ScrollArea>
      </div>
    );
  }
  